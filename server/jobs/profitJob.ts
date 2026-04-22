import cron from 'node-cron';
import { Investment } from '../models/Investment.ts';
import { User } from '../models/User.ts';
import { ProfitHistory } from '../models/Transaction.ts';
import logger from '../utils/logger.ts';

export const initCronJobs = () => {
  // Run every 24 hours at midnight
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running daily profit calculation...');
    try {
      const activeInvestments = await Investment.find({ status: 'active' });

      for (const inv of activeInvestments) {
        const now = new Date();

        // Check if investment has ended
        if (now >= inv.endDate) {
          inv.status = 'completed';
          await inv.save();
          continue;
        }

        // Calculate days elapsed since last profit calc
        const daysElapsed = Math.floor((now.getTime() - inv.lastProfitCalc.getTime()) / (1000 * 60 * 60 * 24));
        if (daysElapsed > 0) {
          // Calculate profit for elapsed days
          const profitAmount = (inv.amount * inv.dailyProfitPercent / 100) * daysElapsed;

          // Update investment
          inv.totalProfitEarned += profitAmount;
          inv.lastProfitCalc = now;
          await inv.save();

          // Update user wallet
          const user = await User.findById(inv.user);
          if (user) {
            user.wallet.totalBalance += profitAmount;
            user.wallet.profitBalance += profitAmount;
            await user.save();

            // Record profit history
            const history = new ProfitHistory({
              user: inv.user,
              investment: inv._id,
              amount: profitAmount,
            });
            await history.save();
          }
        }
      }
      logger.info('Daily profit calculation completed successfully.');
    } catch (error) {
      logger.error('Error in daily profit cron job:', error);
    }
  });
};
