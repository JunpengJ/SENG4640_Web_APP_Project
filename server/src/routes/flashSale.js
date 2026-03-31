const express = require('express');
const { auth } = require('../middleware/auth');
const { enqueuePurchase } = require('../services/queue');
const router = express.Router();

router.post('/:flashSaleId', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { flashSaleId } = req.params;

        const job = await enqueuePurchase(req.user.id, productId, quantity, flashSaleId);
        res.status(202).json({ jobId: job.id, message: 'Purchase request received' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/status/:jobId', auth, async (req, res) => {
    const job = await flashSaleQueue.getJob(req.params.jobId);
    if(!job) return res.status(404).json({ error: 'Job not found' });

    const state = await job.getState();
    const result = job.returnvalue;
    res.json({ state, result });
});

module.exports = router;