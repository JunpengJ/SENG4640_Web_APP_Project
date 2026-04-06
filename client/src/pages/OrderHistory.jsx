import { useState, useEffect } from 'react';
import { getOrders } from '../api';

function OrderHistory() {
    const [orders, setOrders] = useState([]); // State to store the user's orders
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        fetchOrders(); // Fetch orders when the component mounts
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getOrders(); // Fetch order data from the API
            setOrders(res.data); // Set the fetched orders in state
        } catch (err) {
            console.error(err); // Log any errors during the fetch
            alert('Failed to load orders');
        } finally {
            setLoading(false); // Set loading to false after the fetch completes
        }
    };

  if (loading) return <div>Loading orders...</div>; // Display loading message while fetching data
  if (orders.length === 0) return <div>You have no orders yet.</div>; // Display message if no orders are found

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Order #{order.orderNumber}</strong> {/* Display the order number */}
                <span>Status: {order.status}</span> {/* Display the order status */}
                <span>{new Date(order.createdAt).toLocaleDateString()}</span> {/* Display the order creation date */}
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>{item.name} x {item.quantity}</span> {/* Display item name and quantity */}
                        <span>${item.subtotal.toFixed(2)}</span> {/* Display item subtotal */}
                    </div>
                ))}
                <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    Total: ${order.totalAmount.toFixed(2)} {/* Display the total amount for the order */}
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}

// Export the OrderHistory component for use in other parts of the application
export default OrderHistory;