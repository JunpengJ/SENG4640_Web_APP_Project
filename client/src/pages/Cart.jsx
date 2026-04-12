import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem, clearCart, createOrder } from '../api';

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            setCart(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateCartItem(itemId, newQuantity);
            fetchCart();
        } catch (err) {
            console.error(err);
            alert('Failed to update quantity');
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm('Remove this item?')) return;
        try {
            await removeCartItem(itemId);
            fetchCart();
        } catch (err) {
            console.error(err);
            alert('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            await createOrder({});
            alert('Order placed successfully!');
            fetchCart();
        } catch (err) {
            console.log('Full error object:', err);
            console.log('Response data:', err.response?.data);
            const errorMsg = err.response?.data?.error || 'Checkout failed';
            alert(errorMsg);
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading cart...</div>;
    if (!cart || cart.items.length === 0) {
        return <div style={{ padding: '2rem' }}>Your cart is empty.</div>;
    }
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                    const newQty = parseInt(e.target.value, 10);
                                    if (!isNaN(newQty) && newQty >= 1) {
                                        handleUpdateQuantity(item._id, newQty);
                                    }
                                }}
                                style={{ width: '60px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '0.25rem' }}
                            />
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

export default Cart;