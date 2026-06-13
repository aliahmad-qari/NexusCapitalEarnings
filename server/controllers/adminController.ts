import { Request, Response } from 'express';
import { User } from '../models/User.ts';
import { Transaction } from '../models/Transaction.ts';
import { InvestmentPlan, Investment } from '../models/Investment.ts';
import { AdminLog } from '../models/AdminLog.ts';
import { Deposit } from '../models/Deposit.ts';
import { Withdrawal } from '../models/Withdrawal.ts';
import { ReferralSetting, getReferralReward } from '../models/ReferralSetting.ts';

const logAdminAction = async (req: any, action: string, targetId?: string, targetType?: string, details?: string) => {
  try {
    await AdminLog.create({
      adminId: req.userId,
      action,
      targetId,
      targetType,
      details,
      ipAddress: req.ip
    });
  } catch (err) {
    console.error('Error logging admin action:', err);
  }
};

export const approveTransaction = async (req: any, res: Response) => {
  try {
    const { transactionId, status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status !== 'pending') return res.status(400).json({ message: 'Transaction already processed' });

    const user = await User.findById(transaction.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ── 1. Update the existing transaction status (NO new transaction created) ─
    transaction.status = status;
    await transaction.save();

    // ── 2. DEPOSIT ────────────────────────────────────────────────
    if (transaction.type === 'deposit') {
      if (status === 'approved') {

        // Resolve linked deposit record
        const depositRecord = transaction.depositId
          ? await Deposit.findById(transaction.depositId)
          : null;

        // Resolve linked investment
        const investmentId = depositRecord?.investment || transaction.investmentId;

        if (investmentId) {
          const investment = await Investment.findById(investmentId);
          if (investment && investment.status === 'pending') {
            // ── Activate investment ──────────────────────────────
            const now     = new Date();
            const endDate = new Date(now);
            endDate.setDate(endDate.getDate() + investment.totalDays);

            investment.status         = 'active';
            investment.startDate      = now;
            investment.endDate        = endDate;
            investment.lastProfitDate = now;
            investment.remainingDays  = investment.totalDays;
            await investment.save();

            // Track how much is actively invested (NOT spendable)
            user.wallet.depositBalance += transaction.amount;
            await user.save();
            // NOTE: totalBalance is NOT increased here.
            // Wallet grows only via daily ROI, referral reward, or principal return.

            console.log(
              `✅ Deposit approved → Investment ACTIVATED: ${user.email} → ` +
              `${investment.planName} | Start: ${now.toDateString()} | ` +
              `End: ${endDate.toDateString()} | Daily ROI: ${investment.dailyROI}%`
            );
          }
        } else {
          // General deposit with no linked investment — credit wallet directly
          user.wallet.totalBalance   += transaction.amount;
          user.wallet.depositBalance += transaction.amount;
          await user.save();
          console.log(`✅ General deposit credited: PKR ${transaction.amount} → ${user.email}`);
        }

        // Mark deposit record approved
        if (depositRecord) {
          depositRecord.status     = 'approved';
          depositRecord.isUsed     = true;
          depositRecord.approvedBy = req.userId;
          depositRecord.approvedAt = new Date();
          await depositRecord.save();
        }

      } else {
        // Rejected — cancel linked pending investment
        const depositRecord = transaction.depositId
          ? await Deposit.findById(transaction.depositId)
          : null;
        const investmentId = depositRecord?.investment || transaction.investmentId;
        if (investmentId) {
          await Investment.findOneAndUpdate(
            { _id: investmentId, status: 'pending' },
            { status: 'cancelled' }
          );
        }
        if (depositRecord) {
          depositRecord.status = 'rejected';
          await depositRecord.save();
        }
        console.log(`❌ Deposit rejected: ${user.email} — PKR ${transaction.amount}`);
      }
    }

    // ── 3. WITHDRAWAL ─────────────────────────────────────────────
    else if (transaction.type === 'withdraw') {
      if (status === 'approved') {
        // Deduct balance NOW (on approval, not at request time)
        if (user.wallet.totalBalance < transaction.amount) {
          return res.status(400).json({ message: 'User has insufficient balance to process this withdrawal' });
        }
        user.wallet.totalBalance  -= transaction.amount;
        user.wallet.profitBalance  = Math.max(0, user.wallet.profitBalance - transaction.amount);
        await user.save();
        console.log(`✅ Withdrawal approved — deducted PKR ${transaction.amount} from ${user.email}`);
      } else {
        // Rejected — no deduction was made so nothing to refund
        console.log(`❌ Withdrawal rejected — PKR ${transaction.amount} for ${user.email} (no deduction was made)`);
      }
      if (transaction.withdrawalId) {
        await Withdrawal.findByIdAndUpdate(transaction.withdrawalId, { status });
      }
    }

    await logAdminAction(
      req,
      `TRANSACTION_${status.toUpperCase()}`,
      transactionId,
      'Transaction',
      `Amount: PKR ${transaction.amount} | User: ${user.email}`
    );

    res.json({ message: `Transaction ${status}`, transaction });
  } catch (error) {
    console.error('Error in approveTransaction:', error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
};

export const createPlan = async (req: any, res: Response) => {
  try {
    const { name, investmentAmount, dailyROI, durationDays, isActive } = req.body;
    const plan = new InvestmentPlan({
      name,
      investmentAmount,
      dailyROI,
      durationDays,
      isActive: isActive ?? true
    });
    await plan.save();
    
    await logAdminAction(req, 'CREATE_PLAN', plan._id?.toString(), 'InvestmentPlan', `Name: ${plan.name}`);
    
    res.status(201).json(plan);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ message: 'Error creating plan' });
  }
};

export const updatePlan = async (req: any, res: Response) => {
  try {
    const { planId } = req.params;
    const { name, investmentAmount, dailyROI, durationDays, isActive } = req.body;

    const plan = await InvestmentPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (name !== undefined) plan.name = name;
    if (investmentAmount !== undefined) plan.investmentAmount = investmentAmount;
    if (dailyROI !== undefined) plan.dailyROI = dailyROI;
    if (durationDays !== undefined) plan.durationDays = durationDays;
    if (isActive !== undefined) plan.isActive = isActive;

    await plan.save();

    await logAdminAction(req, 'UPDATE_PLAN', planId, 'InvestmentPlan', `Name: ${plan.name}`);

    res.json({ message: 'Plan updated successfully', plan });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ message: 'Error updating plan' });
  }
};

export const deletePlan = async (req: any, res: Response) => {
  try {
    const { planId } = req.params;
    const plan = await InvestmentPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await InvestmentPlan.findByIdAndDelete(planId);
    
    await logAdminAction(req, 'DELETE_PLAN', planId, 'InvestmentPlan', `Name: ${plan.name}`);

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ message: 'Error deleting plan' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email phone')
      .populate({
        path: 'depositId',
        select: 'screenshotUrl transactionReference paymentMethod amount'
      })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

// Get all pending deposits for manual verification
export const getPendingDeposits = async (req: any, res: Response) => {
  try {
    const deposits = await Deposit.find({ status: 'pending' })
      .populate('user', 'name email phone')
      .populate('investment', 'planName investmentAmount startDate')
      .sort({ createdAt: -1 });
    
    res.json(deposits);
  } catch (error) {
    console.error('Error fetching pending deposits:', error);
    res.status(500).json({ message: 'Error fetching deposits' });
  }
};

// Get all deposits (for history/reporting)
export const getAllDeposits = async (req: any, res: Response) => {
  try {
    const { status, userId } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    
    const deposits = await Deposit.find(filter)
      .populate('user', 'name email phone')
      .populate('investment', 'planName investmentAmount startDate')
      .sort({ createdAt: -1 });
    
    res.json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ message: 'Error fetching deposits' });
  }
};

// Get single deposit details
export const getDepositDetails = async (req: any, res: Response) => {
  try {
    const { depositId } = req.params;
    
    const deposit = await Deposit.findById(depositId)
      .populate('user', 'name email phone wallet')
      .populate('investment', 'planName investmentAmount startDate endDate');
    
    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }
    
    res.json(deposit);
  } catch (error) {
    console.error('Error fetching deposit:', error);
    res.status(500).json({ message: 'Error fetching deposit' });
  }
};

export const approveManualDeposit = async (req: any, res: Response) => {
  try {
    const { depositId } = req.params;
    const { status, remarks } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
    }

    const deposit = await Deposit.findById(depositId);
    if (!deposit) return res.status(404).json({ message: 'Deposit not found' });
    if (deposit.status !== 'pending') return res.status(400).json({ message: 'Deposit already processed' });

    const user = await User.findById(deposit.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    deposit.status     = status;
    deposit.approvedBy = req.userId;
    deposit.approvedAt = new Date();
    if (remarks) deposit.adminRemarks = remarks;

    if (status === 'approved') {
      deposit.isUsed = true;
      await deposit.save();

      // ── Activate linked investment ────────────────────────────
      if (deposit.investment) {
        const investment = await Investment.findById(deposit.investment);
        if (investment && investment.status === 'pending') {
          const now     = new Date();
          const endDate = new Date(now);
          endDate.setDate(endDate.getDate() + investment.totalDays);

          investment.status         = 'active';
          investment.startDate      = now;
          investment.endDate        = endDate;
          investment.lastProfitDate = now;
          investment.remainingDays  = investment.totalDays;
          await investment.save();

          // Track invested amount (NOT spendable — not in totalBalance)
          user.wallet.depositBalance += deposit.amount;
          await user.save();

          console.log(`✅ Manual deposit → investment activated: ${user.email} → ${investment.planName}`);
        }
      } else {
        // No linked investment — general deposit, credit wallet
        user.wallet.totalBalance   += deposit.amount;
        user.wallet.depositBalance += deposit.amount;
        await user.save();
        console.log(`✅ Manual general deposit credited: PKR ${deposit.amount} → ${user.email}`);
      }

      // ── Update the existing pending transaction instead of creating a new one ─
      await Transaction.findOneAndUpdate(
        { depositId: deposit._id, status: 'pending' },
        { status: 'approved' }
      );

    } else {
      // Rejected — cancel linked pending investment
      if (deposit.investment) {
        await Investment.findOneAndUpdate(
          { _id: deposit.investment, status: 'pending' },
          { status: 'cancelled' }
        );
      }
      await deposit.save();

      // Update existing transaction to rejected
      await Transaction.findOneAndUpdate(
        { depositId: deposit._id, status: 'pending' },
        { status: 'rejected' }
      );

      console.log(`❌ Manual deposit rejected: ${user.email} — PKR ${deposit.amount}`);
    }

    await logAdminAction(
      req,
      `DEPOSIT_${status.toUpperCase()}`,
      depositId,
      'Deposit',
      `Amount: PKR ${deposit.amount} | User: ${user.email}`
    );

    res.json({ message: `Deposit ${status} successfully`, deposit });
  } catch (error) {
    console.error('Error approving deposit:', error);
    res.status(500).json({ message: 'Error processing deposit' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserStatus = async (req: any, res: Response) => {
  try {
    const { userId, status } = req.body; // blocked or active
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = status === 'blocked';
    await user.save();
    
    await logAdminAction(req, `USER_${status.toUpperCase()}`, userId, 'User');

    res.json({ message: `User ${status} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    await logAdminAction(req, 'DELETE_USER', userId, 'User', `Email: ${user.email}`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const getAdminLogs = async (req: Request, res: Response) => {
  try {
    const logs = await AdminLog.find().populate('adminId', 'name email').sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin logs' });
  }
};

export const getReferralStats = async (req: Request, res: Response) => {
  try {
    const topReferrers = await User.find({ referralCount: { $gt: 0 } })
      .sort({ referralCount: -1 })
      .limit(10)
      .select('name email referralCount wallet');

    const totalReferrals = await User.countDocuments({ referredBy: { $ne: null } });
    const totalReferralEarnings = await User.find({ 'wallet.referralEarnings': { $gt: 0 } })
      .then(users => users.reduce((sum, u) => sum + (u.wallet?.referralEarnings || 0), 0));

    res.json({
      topReferrers,
      totalReferrals,
      totalReferralEarnings
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ message: 'Error fetching referral statistics' });
  }
};

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const activeInvestmentsCount = await Investment.countDocuments({ status: 'active' });
    const activePlans = await InvestmentPlan.countDocuments();
    
    const investments = await Investment.find({ status: 'active' });
    const totalInvestedAmount = investments.reduce((sum, inv) => sum + inv.principalAmount, 0);

    const totalDeposits = await Deposit.find({ status: 'approved' })
      .then(deposits => deposits.reduce((sum, d) => sum + d.amount, 0));

    const totalWithdrawals = await Withdrawal.find({ status: 'approved' })
      .then(withdrawals => withdrawals.reduce((sum, w) => sum + w.amount, 0));

    const pendingTxCount = await Transaction.countDocuments({ status: 'pending' });
    const processedTxCount = await Transaction.countDocuments({ status: { $ne: 'pending' } });
    
    const revenue = totalDeposits; 

    res.json({
      totalUsers,
      activeInvestments: activeInvestmentsCount,
      totalInvestedAmount,
      totalDeposits,
      totalWithdrawals,
      revenue,
      activePlans,
      pendingTransactions: pendingTxCount,
      approvedTransactions: processedTxCount
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ message: 'Error fetching system stats' });
  }
};

// ── All plans (admin view — includes inactive) ────────────────────────────
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await InvestmentPlan.find().sort({ investmentAmount: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans' });
  }
};

// ── Referral setting — GET current reward amount ──────────────────────────
export const getReferralSetting = async (req: Request, res: Response) => {
  try {
    const amount = await getReferralReward();
    const setting = await ReferralSetting.findOne().sort({ updatedAt: -1 });
    res.json({ rewardAmount: amount, updatedAt: setting?.updatedAt || null });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching referral setting' });
  }
};

// ── Referral setting — UPDATE reward amount ───────────────────────────────
export const updateReferralSetting = async (req: any, res: Response) => {
  try {
    const { rewardAmount } = req.body;
    if (!rewardAmount || rewardAmount < 0) {
      return res.status(400).json({ message: 'rewardAmount must be a positive number' });
    }

    // Upsert — one single document in the collection
    const setting = await ReferralSetting.findOneAndUpdate(
      {},
      { rewardAmount, updatedBy: req.userId },
      { upsert: true, new: true }
    );

    await logAdminAction(req, 'UPDATE_REFERRAL_REWARD', setting._id?.toString(), 'ReferralSetting', `Reward: PKR ${rewardAmount}`);

    res.json({ message: `Referral reward updated to PKR ${rewardAmount}`, rewardAmount });
  } catch (error) {
    console.error('Error updating referral setting:', error);
    res.status(500).json({ message: 'Error updating referral setting' });
  }
};
