import { useState, useEffect } from 'react';
import { getProducts } from '../api';
import ProductCard from './ProductCard';

function ProductList({ category }) {
    const [products, setProducts] = useState([]); // Stored product list
    const [loading, setLoading] = useState(true); // Loading state for product fetch

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (category) params.category = category;
            const res = await getProducts(params);
            setProducts(res.data.products || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="products">
            {products.map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}

// Export the ProductList component for use in other parts of the application
export default ProductList;