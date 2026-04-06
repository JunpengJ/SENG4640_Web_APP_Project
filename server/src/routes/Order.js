// Import the express library to create a router
const express = require('express');
// Import authentication and authorization middleware
const { auth, authorize } = require('../middleware/auth');
// Import the Order, Cart, and Product models
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create a new router instance
const router = express.Router();

// Route to create a new order
router.post('/', auth, async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body; // Extract shipping address and payment method from the request body
        
        const cart = await Cart.findOne({ userId: req.user._id }); // Find the cart for the authenticated user
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' }); // Return an error if the cart is empty
        }
      
        for (const item of cart.items) {
            const product = await Product.findById(item.productId); // Check if the product exists and has sufficient stock
            if (!product || product.inventory.available < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
            }
        }
      
        for (const item of cart.items) {
            const updated = await Product.decreaseInventory(item.productId, item.quantity); // Decrease the inventory for each product
            if (!updated) {
                return res.status(400).json({ error: `Failed to update stock for ${item.name}` });
            }
        }
      
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`; // Generate a unique order number
      
        const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calculate the total amount
      
        const order = new Order({
            orderNumber,
            userId: req.user._id,
            items: cart.items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            })),
            totalAmount,
            shippingAddress: shippingAddress || {},
            payment: {
                method: paymentMethod || 'credit_card',
                status: 'pending'
            },
            status: 'processing',
            flashSaleApplied: false
        }); // Create a new order
      
        await order.save(); // Save the order to the database
      
        cart.items = []; // Clear the cart
        await cart.save();
      
        res.status(201).json(order); // Return the created order
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to get all orders for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }); // Find and sort orders by creation date
        res.json(orders); // Return the orders
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to get a specific order by ID
router.get('/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id }); // Find the order by ID and user ID
        if (!order) return res.status(404).json({ error: 'Order not found' }); // Return an error if the order does not exist
        res.json(order); // Return the order
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to update the status of an order
router.put('/:orderId/status', auth, authorize('superAdmin', 'productManager'), async (req, res) => {
    try {
        const { status } = req.body; // Extract the new status from the request body
        if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' }); // Return an error if the status is invalid
        }
        const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true }); // Update the order status
        if (!order) return res.status(404).json({ error: 'Order not found' }); // Return an error if the order does not exist
        res.json(order); // Return the updated order
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Export the router for use in other parts of the application
module.exports = router;