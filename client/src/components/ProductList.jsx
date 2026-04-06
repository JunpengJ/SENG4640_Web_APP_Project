import ProductCard from './ProductCard';
import products from '../data/products';

function ProductList(){
    return(
        <div className="products">
            {/* Map through the products array and render a ProductCard for each product */}
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

// Export the ProductList component for use in other parts of the application
export default ProductList;