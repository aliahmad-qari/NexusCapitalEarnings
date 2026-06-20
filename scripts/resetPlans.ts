/**
 * resetPlans.ts
 *
 * Connects to the LIVE MongoDB database and:
 *   1. Deletes ALL existing InvestmentPlan documents (the old 10%/7-day plans)
 *   2. Inserts the 5 canonical plans with the new values (3%/10 days)
 *
 * Run ONCE after deployment:
 *   npx tsx scripts/resetPlans.ts
 *
 * ⚠️  This DOES NOT affect existing Investment records (active/pending/completed).
 *     Users already invested will continue earning ROI from their own stored
 *     dailyROI and totalDays values — those are copied into each Investment
 *     document at creation time and are independent of the plan template.
 */

import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://ali-islamic:xlUR8DWnt7jpcw2M@cluster0.0nsjvku.mongodb.net/NexusCapital?retryWrites=true&w=majority&appName=Cluster0';

// ── Inline schema (no import needed) ─────────────────────────────────────────
const planSchema = new mongoose.Schema(
  {
    name:             { type: String,  required: true },
    investmentAmount: { type: Number,  required: true },
    dailyROI:         { type: Number,  required: true, default: 3  },
    durationDays:     { type: Number,  required: true, default: 10 },
    isActive:         { type: Boolean, default: true },
  },
  { timestamps: true }
);

const InvestmentPlan =
  (mongoose.models.InvestmentPlan as mongoose.Model<any>) ||
  mongoose.model('InvestmentPlan', planSchema);

// ── New canonical plans (3% / 10 days) ───────────────────────────────────────
const NEW_PLANS = [
  { name: 'Starter Plan',  investmentAmount: 300,   dailyROI: 3, durationDays: 10 },
  { name: 'Bronze Plan',   investmentAmount: 1000,  dailyROI: 3, durationDays: 10 },
  { name: 'Silver Plan',   investmentAmount: 3000,  dailyROI: 3, durationDays: 10 },
  { name: 'Gold Plan',     investmentAmount: 5000,  dailyROI: 3, durationDays: 10 },
  { name: 'Diamond Plan',  investmentAmount: 10000, dailyROI: 3, durationDays: 10 },
];

async function run() {
  console.log('\n🔄  NexusCapital — Plan Reset Script');
  console.log('─'.repeat(55));
  console.log('⚠️   This will DELETE all old plans and insert new ones.');
  console.log('    Active user investments are NOT affected.\n');
  console.log(`📡  Connecting to MongoDB…`);
  console.log(`    URI: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}\n`);

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS:         15000,
    socketTimeoutMS:          30000,
    family: 4,
  });
  console.log('✅  Connected\n');

  // ── Step 1: Show what currently exists ────────────────────────────────────
  const existing = await InvestmentPlan.find().sort({ investmentAmount: 1 });
  console.log(`📋  Found ${existing.length} existing plan(s) in DB:\n`);
  for (const p of existing) {
    console.log(
      `    ${p.isActive ? '🟢' : '🔴'} ${p.name.padEnd(16)} ` +
      `PKR ${String(p.investmentAmount).padStart(6)}  |  ${p.dailyROI}%/day  |  ${p.durationDays} days`
    );
  }

  // ── Step 2: Delete ALL old plans ──────────────────────────────────────────
  console.log('\n🗑   Deleting all old plans…');
  const result = await InvestmentPlan.deleteMany({});
  console.log(`    Deleted ${result.deletedCount} plan(s)\n`);

  // ── Step 3: Insert the new 3%/10-day plans ────────────────────────────────
  console.log('✨  Inserting new plans (3% daily ROI / 10 days):\n');
  for (const plan of NEW_PLANS) {
    await InvestmentPlan.create({ ...plan, isActive: true });
    const dailyProfit = Math.round((plan.investmentAmount * plan.dailyROI) / 100);
    const totalProfit = dailyProfit * plan.durationDays;
    console.log(
      `  ✅  ${plan.name.padEnd(16)} ` +
      `PKR ${String(plan.investmentAmount).padStart(6)}  |  ` +
      `${plan.dailyROI}%/day = PKR ${dailyProfit}/day  |  ` +
      `Total profit: PKR ${totalProfit}  |  ${plan.durationDays} days`
    );
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const finalCount  = await InvestmentPlan.countDocuments();
  const activeCount = await InvestmentPlan.countDocuments({ isActive: true });

  console.log('\n─'.repeat(55));
  console.log(`📊  Plans in DB : ${finalCount}  (${activeCount} active)`);
  console.log('\n🎉  Reset complete! All plans now use 3% daily ROI for 10 days.\n');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('\n❌  Reset failed:', err.message);
  console.error(err.stack);
  mongoose.disconnect();
  process.exit(1);
});
