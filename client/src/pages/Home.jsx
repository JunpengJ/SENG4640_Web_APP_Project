import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import CategoryNav from '../components/CategoryNav'; 

function Home() {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [products, setProducts] = useState([]); // State to store product data
    const [loading, setLoading] = useState(true); // State to track loading status
    
    useEffect(() => {
        fetchProducts(); // Fetch products when the component mounts
    }, [category]);

    const fetchProducts = async () => {
        try {
            const params = {};
            if (category) params.category = category;
            const res = await getProducts(params); // Fetch product data from the API
            setProducts(res.data.products || res.data); // Set the product data
        } catch (err) {
            console.error(err); // Log any errors during the fetch
        } finally {
            setLoading(false); // Set loading to false after the fetch completes
        }
    };

    if (loading) return <div className="loading">Loading products...</div>; // Display loading message while fetching data

    return (
        <>
            <div className="banner">
                {/* Display the welcome banner */}
                <h1>Welcome to Our Store</h1>
                <p>Find the best products at unbeatable prices!</p>
            </div>
            <CategoryNav />
            <div className="products">
                {/* Map through the products array and render a ProductCard for each product */}
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
              ))}
            </div>
        </>
    );
}

// Export the Home component for use in other parts of the application
export default Home;