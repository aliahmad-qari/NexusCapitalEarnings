import cron from 'node-cron';
import { Investment } from '../models/Investment.ts';
import { User } from '../models/User.ts';
import { Transaction } from '../models/Transaction.ts';
import logger from '../utils/logger.ts';

// ─────────────────────────────────────────────────────────────────────────────
//  processROI — called by the cron job every 24 hours.
//  Everything is database-driven: amounts, ROI %, duration all come from the
//  Investment document which was populated from the InvestmentPlan on creation.
// ─────────────────────────────────────────────────────────────────────────────
export async function processROI(): Promise<void> {
  logger.info('🕐 Running daily ROI calculation...');

  const activeInvestments = await Investment.find({ status: 'active' });
  logger.info(`Found ${activeInvestments.length} active investments`);

  let processed = 0;
  let completed = 0;
  let skipped   = 0;

  for (const inv of activeInvestments) {
    try {
      // Guard: only process once per 24h window.
      // null lastProfitDate means investment was just activated — always eligible on day 1.
      const hoursSinceLast = inv.lastProfitDate
        ? (Date.now() - new Date(inv.lastProfitDate).getTime()) / 36e5
        : 25; // treat null as "25 hours ago" = eligible
      if (hoursSinceLast < 20) {
        skipped++;
        logger.info(`⏭ Skipped ${inv._id} — last profit was ${hoursSinceLast.toFixed(1)}h ago`);
        continue;
      }

      const user = await User.findById(inv.user);
      if (!user) {
        logger.error(`User not found for investment ${inv._id}`);
        continue;
      }

      // ── All values come from DB, nothing hardcoded ─────────────
      const dailyProfit = Math.round((inv.principalAmount * inv.dailyROI) / 100);
      const day         = inv.totalDays - inv.remainingDays + 1; // human-readable day number

      // ── Credit daily profit ────────────────────────────────────
      user.wallet.totalBalance  += dailyProfit;
      user.wallet.profitBalance += dailyProfit;

      inv.totalProfitEarned += dailyProfit;
      inv.remainingDays     -= 1;
      inv.lastProfitDate    = new Date();

      // ── Record daily profit transaction ────────────────────────
      await new Transaction({
        user:         inv.user,
        type:         'profit',
        amount:       dailyProfit,
        status:       'completed',
        investmentId: inv._id,
        description:  `Daily ROI ${inv.dailyROI}% — Day ${day}/${inv.totalDays} — ${inv.planName}`,
      }).save();

      logger.info(
        `💰 Day ${day}/${inv.totalDays} | ${user.email} | +PKR ${dailyProfit} ` +
        `| Plan: ${inv.planName} | Remaining: ${inv.remainingDays} days`
      );

      // ── Investment complete ────────────────────────────────────
      if (inv.remainingDays <= 0) {
        inv.status        = 'completed';
        inv.remainingDays = 0;
        completed++;

        // Return principal to user wallet
        user.wallet.totalBalance += inv.principalAmount;
        // Decrement the invested amount from depositBalance tracking
        user.wallet.depositBalance -= inv.principalAmount;

        // Record principal return transaction
        await new Transaction({
          user:         inv.user,
          type:         'investment',
          amount:       inv.principalAmount,
          status:       'completed',
          investmentId: inv._id,
          description:  `Principal returned — ${inv.planName} completed (PKR ${inv.principalAmount.toLocaleString('en-PK')})`,
        }).save();

        logger.info(
          `✅ COMPLETED: ${user.email} | ${inv.planName} | ` +
          `Principal returned: PKR ${inv.principalAmount} | ` +
          `Total profit earned: PKR ${inv.totalProfitEarned}`
        );
      }

      await user.save();
      await inv.save();
      processed++;

    } catch (err) {
      logger.error(`Error processing investment ${inv._id}:`, err);
    }
  }

  logger.info(
    `✨ ROI job done — Processed: ${processed} | Completed: ${completed} | Skipped: ${skipped}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  initCronJobs — registers the 24-hour schedule
// ─────────────────────────────────────────────────────────────────────────────
export const initCronJobs = (): void => {
  // Run every hour — each investment is individually guarded by its own 24h window
  // (based on lastProfitDate). This means profits are credited within 1h of the
  // 24h mark rather than waiting until next midnight.
  cron.schedule('0 * * * *', async () => {
    try {
      await processROI();
    } catch (error) {
      logger.error('❌ Unhandled error in ROI cron job:', error);
    }
  });

  logger.info('✅ Cron job scheduled — ROI checks run every hour, paid per 24h window per investment');
};
