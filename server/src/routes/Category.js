const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Category = require('../models/Category');

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort('name');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, authorize('productManager', 'superAdmin'), async (req, res) => {
    try {
        const { name, slug, description, image, parenId } = req.body;
        const category = new Category({ name, slug, description, image, parentId });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', auth, authorize('productManager', 'superAdmin'), async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', auth, authorize('superAdmin'), async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, {isActive: false});
        res.json({ message: 'Category deactivated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;