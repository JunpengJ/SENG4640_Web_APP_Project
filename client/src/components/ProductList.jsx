import ProductCard from './ProductCard';
import products from '../data/products';
function ProductList(){
    return(
        <div className="products">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
    );
}
export default ProductList;