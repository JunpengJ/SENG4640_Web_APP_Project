const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/ /g, '_').replace(/[^w-]/g, '');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);