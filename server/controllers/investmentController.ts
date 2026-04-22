import { Request, Response } from 'express';
import { User } from '../models/User.ts';
import { Investment, InvestmentPlan } from '../models/Investment.ts';
import { Transaction } from '../models/Transaction.ts';

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await InvestmentPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans' });
  }
};

export const createInvestment = async (req: any, res: Response) => {
  try {
    const { planId, amount } = req.body;
    const user = await User.findById(req.userId);
    const plan = await InvestmentPlan.findById(planId);

    if (!user || !plan) {
      return res.status(404).json({ message: 'User or Plan not found' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    if (amount < plan.minInvestment || amount > plan.maxInvestment) {
      return res.status(400).json({ message: `Amount must be between ${plan.minInvestment} and ${plan.maxInvestment}` });
    }

    if (user.wallet.totalBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct from balance
    user.wallet.totalBalance -= amount;
    user.wallet.depositBalance = Math.max(0, user.wallet.depositBalance - amount);
    await user.save();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const investment = new Investment({
      user: req.userId,
      plan: planId,
      amount,
      dailyProfitPercent: plan.dailyProfitPercent,
      endDate,
    });

    await investment.save();

    const transaction = new Transaction({
      user: req.userId,
      type: 'investment',
      amount,
      status: 'completed',
      description: `Invested in ${plan.name} plan`,
    });
    await transaction.save();

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating investment' });
  }
};

export const getMyInvestments = async (req: any, res: Response) => {
  try {
    const investments = await Investment.find({ user: req.userId }).populate('plan').sort({ startDate: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching investments' });
  }
};
