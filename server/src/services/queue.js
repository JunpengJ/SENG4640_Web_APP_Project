// Import the Bull library for creating and managing queues
const Queue = require('bull');
// Configuration for connecting to the Redis server
const redisConfig = { url: process.env.REDIS_URL };

// Create a queue for handling flash sale purchases
const flashSaleQueue = new Queue('flash sale', redisConfig);

// Function to enqueue a purchase job into the flash sale queue
const enqueuePurchase = (userId, productId, quantity, flashSaleId = null) => {
    return flashSaleQueue.add({ userId, productId, quantity, flashSaleId }); // Add the job to the queue
};

// Export the queue and enqueue function for use in other parts of the application
module.exports = { flashSaleQueue, enqueuePurchase };