const express = require('express');
const router = express.Router();
const Promo = require('../models/Promo');

// GET /promos : Fetch all active promo codes.
router.get('/', async (req, res) => {
  try {
    // Find promos with status "active" and with an expiration date in the future.
    const promos = await Promo.find({
      status: 'active',
      expirationDate: { $gt: new Date() },
    });
    res.json(promos);
  } catch (err) {
    console.error('Error fetching promos: ', err);
    res.status(500).json({ error: 'Error fetching promo codes' });
  }
});

module.exports = router; 