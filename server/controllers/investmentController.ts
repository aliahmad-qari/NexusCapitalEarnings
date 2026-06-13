import { Request, Response } from 'express';
import path from 'path';
import { User } from '../models/User.ts';
import { Investment, InvestmentPlan } from '../models/Investment.ts';
import { Transaction } from '../models/Transaction.ts';
import { Deposit } from '../models/Deposit.ts';
import { Referral } from '../models/Referral.ts';
import { getReferralReward } from '../models/ReferralSetting.ts';

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/investment/plans
// ─────────────────────────────────────────────────────────────────────────────
export const getPlans = async (_req: Request, res: Response) => {
  try {
    const plans = await InvestmentPlan.find({ isActive: true, investmentAmount: { $exists: true, $gt: 0 } });

    res.json(plans.map(plan => {
      const amt    = plan.investmentAmount!;
      const roi    = plan.dailyROI!;
      const days   = plan.durationDays!;
      const profit = Math.round((amt * roi * days) / 100);
      return {
        _id:              plan._id,
        name:             plan.name,
        investmentAmount: amt,
        dailyROI:         roi,
        durationDays:     days,
        displayAmount:    `PKR ${amt.toLocaleString('en-PK')}`,
        totalProfit:      profit,
        totalReturn:      amt + profit,
        isActive:         plan.isActive,
      };
    }));
  } catch (error) {
    console.error('getPlans error:', error);
    res.status(500).json({ message: 'Error fetching plans' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/investment/deposit-request  (multipart/form-data)
//
//  Single endpoint that atomically creates:
//    • Deposit  (with screenshot + payment proof)
//    • Investment (pending, linked to deposit)
//    • Transaction (pending, linked to both)
//
//  No second call to /wallet/deposit-manual needed. One request = one record set.
// ─────────────────────────────────────────────────────────────────────────────
export const createDepositRequest = async (req: any, res: Response) => {
  try {
    const { planId, paymentMethod, transactionReference } = req.body;

    console.log(`📥 deposit-request received — planId: "${planId}", method: ${paymentMethod}, file: ${req.file?.originalname || 'MISSING'}`);

    // ── Validate required fields ──────────────────────────────────
    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }
    if (!paymentMethod || !['jazzcash', 'easypaisa'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Payment method must be jazzcash or easypaisa' });
    }
    if (!transactionReference?.trim()) {
      return res.status(400).json({ message: 'Transaction reference is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required' });
    }

    const user = await User.findById(req.userId);
    const plan = await InvestmentPlan.findById(planId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!plan)  return res.status(404).json({ message: `Plan not found (received planId: "${planId}"). Ensure the plan exists and is active.` });
    if (!plan.isActive) return res.status(400).json({ message: `Plan "${plan.name}" is currently inactive. Contact admin.` });

    const investmentAmount  = plan.investmentAmount!;
    const screenshotFilename = req.file.filename || path.basename(req.file.path);

    // ── 1. Create PENDING deposit (with payment proof) ────────────
    const deposit = new Deposit({
      user:                 req.userId,
      amount:               investmentAmount,
      paymentMethod,
      transactionReference: transactionReference.trim(),
      screenshotUrl:        screenshotFilename,   // filename only — served via /uploads/deposits/
      status:               'pending',
      isUsed:               false,
      plan:                 planId,
    });
    await deposit.save();

    // ── 2. Create PENDING investment ──────────────────────────────
    //    lastProfitDate = null → cron treats as "never processed", eligible on day 1
    //    Real dates are set by admin on approval
    const placeholderStart = new Date();
    const placeholderEnd   = new Date();
    placeholderEnd.setDate(placeholderEnd.getDate() + plan.durationDays!);

    const investment = new Investment({
      user:            req.userId,
      plan:            planId,
      deposit:         deposit._id,
      planName:        plan.name,
      principalAmount: investmentAmount,
      dailyROI:        plan.dailyROI,
      totalDays:       plan.durationDays,
      remainingDays:   plan.durationDays,
      startDate:       placeholderStart,
      endDate:         placeholderEnd,
      lastProfitDate:  null,
      status:          'pending',
    });
    await investment.save();

    // ── 3. Back-link deposit → investment ─────────────────────────
    deposit.investment = investment._id as any;
    await deposit.save();

    // ── 4. ONE pending transaction (updated on admin approval — never duplicated) ─
    const transaction = new Transaction({
      user:         req.userId,
      type:         'deposit',
      amount:       investmentAmount,
      status:       'pending',
      depositId:    deposit._id,
      investmentId: investment._id,
      description:  `Deposit via ${paymentMethod.toUpperCase()} for ${plan.name} — PKR ${investmentAmount.toLocaleString('en-PK')} | Ref: ${transactionReference.trim()}`,
    });
    await transaction.save();

    // ── 5. Back-link deposit → transaction ────────────────────────
    deposit.transactionId = transaction._id as any;
    await deposit.save();

    console.log(`📋 Deposit request: ${user.email} → ${plan.name} — PKR ${investmentAmount} via ${paymentMethod}`);

    res.status(201).json({
      message: 'Deposit submitted. Admin will verify and activate your plan within 24 hours.',
      deposit: {
        _id:    deposit._id,
        amount: deposit.amount,
        status: deposit.status,
      },
      investment: {
        _id:             investment._id,
        planName:        investment.planName,
        principalAmount: investment.principalAmount,
        dailyROI:        investment.dailyROI,
        totalDays:       investment.totalDays,
        status:          investment.status,
      },
    });
  } catch (error: any) {
    console.error('createDepositRequest error:', error);
    res.status(500).json({ message: error.message || 'Error creating deposit request' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/investment/my
// ─────────────────────────────────────────────────────────────────────────────
export const getMyInvestments = async (req: any, res: Response) => {
  try {
    const investments = await Investment.find({ user: req.userId }).sort({ createdAt: -1 });

    res.json(investments.map(inv => {
      const dailyProfit        = Math.round((inv.principalAmount * inv.dailyROI) / 100);
      const totalExpectedProfit = dailyProfit * inv.totalDays;
      const completedDays      = inv.totalDays - inv.remainingDays;
      const progressPct        = inv.totalDays > 0
        ? Math.min(Math.round((completedDays / inv.totalDays) * 100), 100)
        : 0;

      // Next payout = lastProfitDate + 24h (null → startDate + 24h)
      let nextPayoutDate: Date | null = null;
      if (inv.status === 'active') {
        const base = inv.lastProfitDate
          ? new Date(inv.lastProfitDate)
          : new Date(inv.startDate);
        nextPayoutDate = new Date(base.getTime() + 24 * 60 * 60 * 1000);
      }

      return {
        _id:                    inv._id,
        planName:               inv.planName,
        principalAmount:        inv.principalAmount,
        displayPrincipalAmount: `PKR ${inv.principalAmount.toLocaleString('en-PK')}`,
        dailyROI:               inv.dailyROI,
        dailyProfit,
        totalExpectedProfit,
        totalReturn:            inv.principalAmount + totalExpectedProfit,
        totalDays:              inv.totalDays,
        remainingDays:          inv.remainingDays,
        completedDays,
        progressPct,
        totalProfitEarned:      inv.totalProfitEarned,
        startDate:              inv.startDate,
        endDate:                inv.endDate,
        lastProfitDate:         inv.lastProfitDate,
        nextPayoutDate,
        status:                 inv.status,
        depositId:              inv.deposit,
        createdAt:              inv.createdAt,
      };
    }));
  } catch (error: any) {
    console.error('getMyInvestments error:', error);
    res.status(500).json({ message: 'Error fetching investments' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/investment/my-referrals
// ─────────────────────────────────────────────────────────────────────────────
export const getMyReferrals = async (req: any, res: Response) => {
  try {
    const records = await Referral.find({ inviterId: req.userId })
      .populate('referredUserId', 'name email createdAt')
      .sort({ createdAt: -1 });

    // Current reward from DB — this is what future signups will earn.
    // Past earnings are stored in user.wallet.referralEarnings (source of truth).
    const rewardAmount = await getReferralReward();

    // Fetch the inviter's actual referral earnings balance from DB
    const inviter = await User.findById(req.userId).select('wallet.referralEarnings referralCount');
    const actualTotalEarned = inviter?.wallet?.referralEarnings ?? 0;

    const list = records.map((r: any) => ({
      _id:      r._id,
      name:     r.referredUserId?.name  || 'Unknown',
      email:    r.referredUserId?.email || '—',
      joinedAt: r.createdAt,
      // Individual reward = actualTotalEarned / count gives average per referral.
      // Better: show current rewardAmount per row (what was credited may differ
      // if admin changed the rate, but we use actual earnings for the total).
      reward:   rewardAmount,
    }));

    res.json({
      referrals:    list,
      totalCount:   list.length,
      rewardAmount,
      totalEarned:  actualTotalEarned,   // ← actual wallet balance, not computed
    });
  } catch (error: any) {
    console.error('getMyReferrals error:', error);
    res.status(500).json({ message: 'Error fetching referrals' });
  }
};
