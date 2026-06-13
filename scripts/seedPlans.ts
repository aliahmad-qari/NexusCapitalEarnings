/**
 * seedPlans.ts
 *
 * Standalone script — connects directly to MongoDB and ensures the 5
 * canonical investment plans exist with correct values.
 *
 * Run:
 *   npx tsx scripts/seedPlans.ts
 *
 * Troubleshooting ECONNREFUSED:
 *   1. Go to MongoDB Atlas → Network Access → Add your current IP
 *   2. Or temporarily set "Allow access from anywhere" (0.0.0.0/0)
 *   3. Or set MONGODB_URI env var to override the connection string
 */

import mongoose from 'mongoose';

// ── Try both SRV and standard connection formats ──────────────────────────────
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://ali-islamic:xlUR8DWnt7jpcw2M@cluster0.0nsjvku.mongodb.net/NexusCapital?retryWrites=true&w=majority&appName=Cluster0';

// ── InvestmentPlan schema (inline — no import needed) ─────────────────────────
const investmentPlanSchema = new mongoose.Schema(
  {
    name:             { type: String,  required: true },
    investmentAmount: { type: Number,  required: true },
    dailyROI:         { type: Number,  required: true, default: 10 },
    durationDays:     { type: Number,  required: true, default: 7  },
    isActive:         { type: Boolean, default: true },
  },
  { timestamps: true }
);

const InvestmentPlan =
  (mongoose.models.InvestmentPlan as mongoose.Model<any>) ||
  mongoose.model('InvestmentPlan', investmentPlanSchema);

// ── The canonical plans ────────────────────────────────────────────────────────
const CANONICAL_PLANS = [
  { name: 'Starter Plan',  investmentAmount: 300,   dailyROI: 10, durationDays: 7  },
  { name: 'Bronze Plan',   investmentAmount: 1000,  dailyROI: 10, durationDays: 7  },
  { name: 'Silver Plan',   investmentAmount: 3000,  dailyROI: 10, durationDays: 7  },
  { name: 'Gold Plan',     investmentAmount: 5000,  dailyROI: 10, durationDays: 7  },
  { name: 'Diamond Plan',  investmentAmount: 10000, dailyROI: 10, durationDays: 7  },
];

async function run() {
  console.log('\n🌱  NexusCapital — Plan Seeder');
  console.log('─'.repeat(50));
  console.log(`📡  Connecting to MongoDB…`);
  console.log(`    URI: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}\n`); // hide password

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,  // 15s timeout
    connectTimeoutMS:         15000,
    socketTimeoutMS:          30000,
    family: 4,                        // force IPv4 — fixes some Windows DNS issues
  });
  console.log('✅  Connected\n');

  // ── Step 1: Remove exact duplicate plan names (keep oldest) ────────────────
  const allPlans = await InvestmentPlan.find().sort({ createdAt: 1 });
  const seen = new Set<string>();
  let duplicatesRemoved = 0;

  for (const p of allPlans) {
    const key = p.name.trim().toLowerCase();
    if (seen.has(key)) {
      await InvestmentPlan.findByIdAndDelete(p._id);
      console.log(`🗑  Removed duplicate: "${p.name}"  (id: ${p._id})`);
      duplicatesRemoved++;
    } else {
      seen.add(key);
    }
  }

  if (duplicatesRemoved === 0) console.log('✔  No duplicates found');

  // ── Step 2: Remove plans with missing / zero investmentAmount ───────────────
  const broken = await InvestmentPlan.find({
    $or: [
      { investmentAmount: { $exists: false } },
      { investmentAmount: 0 },
      { investmentAmount: null },
    ],
  });

  for (const p of broken) {
    await InvestmentPlan.findByIdAndDelete(p._id);
    console.log(`🗑  Removed broken plan (no amount): "${p.name}"  (id: ${p._id})`);
  }

  if (broken.length === 0) console.log('✔  No broken plans found');

  // ── Step 3: Upsert the 5 canonical plans ────────────────────────────────────
  console.log('\n📋  Upserting canonical plans…\n');

  for (const plan of CANONICAL_PLANS) {
    const existing = await InvestmentPlan.findOne({ name: plan.name });

    if (!existing) {
      await InvestmentPlan.create({ ...plan, isActive: true });
      console.log(
        `  ✅  Created  →  ${plan.name.padEnd(16)} ` +
        `PKR ${String(plan.investmentAmount).padStart(6)}  |  ${plan.dailyROI}%/day  |  ${plan.durationDays} days`
      );
    } else {
      // Update all fields to canonical values, ensure active
      existing.investmentAmount = plan.investmentAmount;
      existing.dailyROI         = plan.dailyROI;
      existing.durationDays     = plan.durationDays;
      existing.isActive         = true;
      await existing.save();
      console.log(
        `  🔄  Updated  →  ${plan.name.padEnd(16)} ` +
        `PKR ${String(plan.investmentAmount).padStart(6)}  |  ${plan.dailyROI}%/day  |  ${plan.durationDays} days`
      );
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  const finalCount = await InvestmentPlan.countDocuments();
  const activeCount = await InvestmentPlan.countDocuments({ isActive: true });

  console.log('\n─'.repeat(50));
  console.log(`📊  Total plans in DB : ${finalCount}`);
  console.log(`✅  Active plans      : ${activeCount}`);
  console.log('\n🎉  Seed complete!\n');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('\n❌  Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
