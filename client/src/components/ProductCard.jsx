import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addToCart } from '../api';
import FlashSaleButton from './FlashSaleButton';

function ProductCard({ product, flashSale = null }) {
    const { user } = useAuth(); // Get the current authenticated user
    const navigate = useNavigate(); // Hook to navigate between routes

    const handleAddToCart = async () => {
        if (!user) {
            alert('Please login first'); // Alert the user to log in if not authenticated
            navigate('/login'); // Redirect to the login page
            return;
        }
        try {
            await addToCart(product._id, 1); // Add the product to the cart
            alert(`Added ${product.name} to cart`);
        } catch (err) {
            console.error(err); // Log any errors during the add-to-cart process
            alert('Failed to add to cart');
        }
    };

  const isFlashSale = flashSale !== null && flashSale.remainingStock > 0; // Check if the product is part of a flash sale
  const displayPrice = isFlashSale ? flashSale.salePrice : product.price; // Determine the price to display
  const originalPrice = isFlashSale ? product.price : null; // Determine the original price if on flash sale

  return (
    <div className="product-card">
        {/* Display product image */}
        <img src={product.images?.[0] || 'https://via.placeholder.com/200x150'} alt={product.name} />
        <h3>{product.name}</h3>
        <div>
            {isFlashSale ? (
                <>
                    {/* Display sale price and original price */}
                    <span className="sale-price">${displayPrice}</span>
                    {' '}
                    <span className="original-price">${originalPrice}</span>
                </>
            ) : (
              <span>${displayPrice}</span>
            )}
        </div>
        {isFlashSale ? (
            <FlashSaleButton
                flashSaleId={flashSale._id} // Pass flash sale ID to the FlashSaleButton component
                productId={product._id} // Pass product ID to the FlashSaleButton component
                productName={product.name} // Pass product name to the FlashSaleButton component
                disabled={flashSale.remainingStock <= 0} // Disable button if stock is empty
            />
        ) : (
          <button onClick={handleAddToCart}>Add to Cart</button> // Add to cart button for non-flash sale products
        )}
    </div>
  );
}

// Export the ProductCard component for use in other parts of the application
export default ProductCard;