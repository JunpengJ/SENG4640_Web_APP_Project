// Import the express library to create a router
const express = require('express');
// Import authentication and authorization middleware
const { auth, authorize } = require('../middleware/auth');
// Import the Product model
const Product = require('../models/Product');

// Create a new router instance
const router = express.Router();

// Route to get a paginated list of products
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, category, minPrice, maxPrice, keyword } = req.query; // Extract query parameters
        const filter = { isActive: true }; // Filter for active products
        
        if (category) {
            // Filter by category
            filter.categories = category;
        } 
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice); // Filter by minimum price
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice); // Filter by maximum price
        }
        if (keyword) {
            filter.$or = [
                { name: { $regex: keyword, $options: 'i' } }, // Search by name
                { description: { $regex: keyword, $options: 'i' } } // Search by description
            ];
        }
      
        const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate the number of documents to skip
        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }); // Fetch products with pagination and sorting
        const total = await Product.countDocuments(filter); // Count the total number of matching products
      
        res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / limit) }); // Return the products and pagination info
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to get a specific product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Find the product by ID
        if (!product || !product.isActive) return res.status(404).json({ error: 'Product not found' }); // Return an error if the product does not exist or is inactive
        res.json(product); // Return the product
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to create a new product
router.post('/', auth, authorize('productManager', 'superAdmin'), async (req, res) => {
    try {
        const { name, description, price, categories, images, inventory } = req.body; // Extract product details from the request body
        const product = new Product({
            name,
            description,
            price,
            categories,
            images,
            inventory: inventory || { total: 0, reserved: 0, available: 0 } // Set default inventory if not provided
        }); // Create a new product instance
        await product.save(); // Save the product to the database
        res.status(201).json(product); // Return the created product
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to update an existing product
router.put('/:id', auth, authorize('productManager', 'superAdmin'), async (req, res) => {
    try {
        const allowedUpdates = ['name', 'description', 'price', 'categories', 'images', 'inventory', 'isActive']; // Define allowed fields for update
        const updates = {};
        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) updates[key] = req.body[key]; // Collect updates from the request body
        }
        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }); // Update the product
        if (!product) return res.status(404).json({ error: 'Product not found' }); // Return an error if the product does not exist
        res.json(product); // Return the updated product
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to deactivate a product
router.delete('/:id', auth, authorize('productManager', 'superAdmin'), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }); // Deactivate the product
        if (!product) return res.status(404).json({ error: 'Product not found' }); // Return an error if the product does not exist
        res.json({ message: 'Product deactivated' }); // Return a success message
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Export the router for use in other parts of the application
module.exports = router;