const Queue = require('bull');
const redisConfig = { url: process.env.REDIS_URL };

const flashSaleQueue = new Queue('flash sale', redisConfig);

const enqueuePurchase = (userId, productId, quantity, flashSaleId = null) => {
    return flashSaleQueue.add({ userId, productId, quantity, flashSaleId });
};

module.exports = { flashSaleQueue, enqueuePurchase };