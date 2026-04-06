// Import the express library to create a router
const express = require('express');
// Import the authentication middleware
const { auth } = require('../middleware/auth');
// Import the Cart and Product models
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create a new router instance
const router = express.Router();

// Route to get the current user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }); // Find the cart for the authenticated user
        if (!cart) {
          cart = new Cart({ userId: req.user._id, items: [] }); // Create a new cart if none exists
          await cart.save();
        }
        res.json(cart); // Return the cart
    } catch (error) {
        console.error('Error in POST /cart:', error);
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to add an item to the cart
router.post('/', auth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body; // Extract product ID and quantity from the request body
        if (!productId) return res.status(400).json({ error: 'productId required' });

        const product = await Product.findById(productId); // Find the product by ID
        if (!product) return res.status(404).json({ error: 'Product not found' });

        let cart = await Cart.findOne({ userId: req.user._id }); // Find the cart for the authenticated user
        if (!cart) {
          cart = new Cart({ userId: req.user._id, items: [] }); // Create a new cart if none exists
        }

        const existingIndex = cart.items.findIndex(item => item.productId.toString() === productId); // Check if the product is already in the cart
        if (existingIndex > -1) {
          cart.items[existingIndex].quantity += quantity; // Update the quantity if the product exists
        } else {
          cart.items.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity
          }); // Add the product to the cart
        }

        await cart.save(); // Save the updated cart
        res.json(cart); // Return the updated cart
    } catch (error) {
        console.error('Error in POST /cart:', error);
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to update the quantity of an item in the cart
router.put('/:itemId', auth, async (req, res) => {
    try {
        const { quantity } = req.body; // Extract the new quantity from the request body
        if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });
        
        const cart = await Cart.findOne({ userId: req.user._id }); // Find the cart for the authenticated user
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        
        const item = cart.items.id(req.params.itemId); // Find the item in the cart by ID
        if (!item) return res.status(404).json({ error: 'Item not found' });
        
        item.quantity = quantity; // Update the quantity of the item
        await cart.save(); // Save the updated cart
        res.json(cart); // Return the updated cart
    } catch (error) {
        console.error('Error in PUT /cart/:itemId:', error);
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to remove an item from the cart
router.delete('/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }); // Find the cart for the authenticated user
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        
        cart.items.pull(req.params.itemId); // Remove the item from the cart
        await cart.save(); // Save the updated cart
        res.json(cart); // Return the updated cart
    } catch (error) {
        console.error('Error in DELETE /cart/:itemId:', error);
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to clear all items from the cart
router.delete('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }); // Find the cart for the authenticated user
        if (cart) {
          cart.items = []; // Clear all items from the cart
          await cart.save(); // Save the updated cart
        }
        res.json({ message: 'Cart cleared' }); // Return a success message
    } catch (error) {
        console.error('Error in DELETE /cart/:itemId:', error);
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Export the router for use in other parts of the application
module.exports = router;