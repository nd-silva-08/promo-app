const cron = require('node-cron');
const Promo = require('../models/Promo');

/**
 * startScheduler()
 * Schedules a daily job at midnight to mark promos expired.
 */
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    // Update promotions that have expired.
    const expiredPromos = await Promo.updateMany(
      { expirationDate: { $lte: now }, status: 'active' },
      { $set: { status: 'expired' } }
    );
    console.log(
      `Scheduler: Marked ${expiredPromos.modifiedCount} promo(s) as expired.`
    );
  } catch (err) {
    console.error('Scheduler error:', err);
  }
}); 