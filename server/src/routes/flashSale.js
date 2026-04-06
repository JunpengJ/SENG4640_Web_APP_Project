// Import the express library to create a router
const express = require('express');
// Import the authentication middleware
const { auth } = require('../middleware/auth');
// Import the flash sale queue and enqueue function
const { flashSaleQueue, enqueuePurchase } = require('../services/queue');

const FlashSale = require('../models/FlashSale');

// Create a new router instance
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 为了测试，先返回所有闪购数据（不限制状态和时间）
    const flashSales = await FlashSale.find().populate('productId');
    res.json(flashSales);
  } catch (error) {
    console.error('GET /flashsales error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/v2', async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    const now = new Date();
    let filter = {};
    if (status === 'active') {
      filter = { startTime: { $lte: now }, endTime: { $gte: now } };
    } else if (status === 'upcoming') {
      filter = { startTime: { $gt: now } };
    } else if (status === 'ended') {
      filter = { endTime: { $lt: now } };
    }
    const flashSales = await FlashSale.find(filter).populate('productId');
    res.json(flashSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the flash sale product list
router.get('/', async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    const now = new Date();
    let filter = {};
    if (status === 'active') {
      filter = { startTime: { $lte: now }, endTime: { $gte: now }, status: 'active' };
    } else if (status === 'upcoming') {
      filter = { startTime: { $gt: now }, status: 'upcoming' };
    } else if (status === 'ended') {
      filter = { endTime: { $lt: now }, status: 'ended' };
    }
    const flashSales = await FlashSale.find(filter).populate('productId');
    res.json(flashSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle a purchase request for a flash sale
router.post('/:flashSaleId', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body; // Extract product ID and quantity from the request body
        const { flashSaleId } = req.params; // Extract the flash sale ID from the route parameters

        const flashSale = await FlashSale.findById(flashSaleId); // Find the flash sale by ID
        if (!flashSale) {
            return res.status(404).json({ error: 'Flash sale not found' }); // Return an error if the flash sale does not exist
        }
        if (!flashSale.isActive()) {
            return res.status(400).json({ error: 'Flash sale is not active' }); // Return an error if the flash sale is not active
        }
        if (flashSale.remainingStock < quantity) {
            return res.status(400).json({ error: 'Flash sale stock insufficient' }); // Return an error if there is not enough stock
        }

        const job = await enqueuePurchase(req.user._id, productId, quantity, flashSaleId); // Enqueue the purchase request
        res.status(202).json({ jobId: job.id, message: 'Purchase request received' }); // Return a success response with the job ID
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to check the status of a flash sale purchase job
router.get('/status/:jobId', auth, async (req, res) => {
    const job = await flashSaleQueue.getJob(req.params.jobId); // Get the job by ID from the queue
    if(!job) return res.status(404).json({ error: 'Job not found' }); // Return an error if the job does not exist

    const state = await job.getState(); // Get the current state of the job
    const result = job.returnvalue; // Get the result of the job
    res.json({ state, result }); // Return the job state and result
});

// Route to create a new flash sale
router.post('/', auth, async (req, res) => {
    try {
        if (!['productManager', 'superAdmin'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' }); // Return an error if the user does not have the required role
        }
        const { productId, salePrice, initialStock, startTime, endTime } = req.body; // Extract flash sale details from the request body
        const flashSale = new FlashSale({
            productId,
            salePrice,
            initialStock,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        }); // Create a new flash sale instance
        await flashSale.save(); // Save the flash sale to the database
        res.status(201).json(flashSale); // Return the created flash sale
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Export the router for use in other parts of the application
module.exports = router;