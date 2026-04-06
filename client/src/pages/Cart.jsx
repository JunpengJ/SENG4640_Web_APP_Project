import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem, clearCart, createOrder } from '../api';

function Cart() {
    const [cart, setCart] = useState(null); // State to store cart data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [checkoutLoading, setCheckoutLoading] = useState(false); // State to track checkout process

    useEffect(() => {
        fetchCart(); // Fetch cart data when the component mounts
    }, []);

    const fetchCart = async () => {
        try {
          const res = await getCart(); // Fetch cart data from the API
          setCart(res.data);
        } catch (err) {
          console.error(err); // Log any errors during the fetch
          alert('Failed to load cart');
        } finally {
          setLoading(false); // Set loading to false after the fetch completes
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent updating to a quantity less than 1
        try {
          await updateCartItem(itemId, newQuantity); // Update the quantity of the cart item
          fetchCart(); // Refresh the cart data
        } catch (err) {
          console.error(err); // Log any errors during the update
          alert('Failed to update quantity');
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm('Remove this item?')) return; // Confirm before removing the item
        try {
          await removeCartItem(itemId); // Remove the item from the cart
          fetchCart(); // Refresh the cart data
        } catch (err) {
          console.error(err); // Log any errors during the removal
          alert('Failed to remove item');
        }
    };

     const handleCheckout = async () => {
        setCheckoutLoading(true); // Set checkout loading to true
        try {
            await createOrder({}); // Create an order
            alert('Order placed successfully!');
            fetchCart(); // Refresh the cart data
        } catch (err) {
            console.error(err); // Log any errors during checkout
            alert('Checkout failed');
        } finally {
            setCheckoutLoading(false); // Set checkout loading to false
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading cart...</div>; // Display loading message while fetching data
    if (!cart || cart.items.length === 0) {
        return <div style={{ padding: '2rem' }}>Your cart is empty.</div>; // Display message if the cart is empty
    }
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calculate the total price

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
            <h2>Shopping Cart</h2>
            <div style={{ borderTop: '1px solid #ddd', marginTop: '1rem' }}>
                {cart.items.map((item) => (
                    <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                        <div style={{ flex: 3 }}>{item.name}</div>
                        <div style={{ flex: 1 }}>${item.price.toFixed(2)}</div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                        <div style={{ flex: 1 }}>${(item.price * item.quantity).toFixed(2)}</div>
                        <button onClick={() => handleRemoveItem(item._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <strong>Total: ${total.toFixed(2)}</strong>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => clearCart().then(fetchCart)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Clear Cart</button>
                <button onClick={handleCheckout} disabled={checkoutLoading} style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                    {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
            </div>
        </div>
    );
}

// Export the Cart component for use in other parts of the application
export default Cart;