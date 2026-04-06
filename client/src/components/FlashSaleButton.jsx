import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { placeFlashSaleOrder, getOrderStatus } from '../api';

function FlashSaleButton({ flashSaleId, productId, productName, disabled = false }) {
    const { user } = useAuth(); // Get the current authenticated user
    const [processing, setProcessing] = useState(false); // State to track if the button is processing
    const [statusMsg, setStatusMsg] = useState(''); // State to display the status message

    const handleFlashSale = async () => {
        if (!user) {
          alert('Please login first'); // Alert the user to log in if not authenticated
          return;
        }
        setProcessing(true);
        setStatusMsg('Placing order...');
        try {
            const res = await placeFlashSaleOrder(flashSaleId, productId, 1); // Place the flash sale order
            const jobId = res.data.jobId;
            setStatusMsg('Order received, processing...');
            
            const interval = setInterval(async () => {
                try {
                    const statusRes = await getOrderStatus(jobId); // Check the order status periodically
                    if (statusRes.data.state === 'completed') {
                        clearInterval(interval);
                        setStatusMsg('Purchase successful!');
                        setProcessing(false);
                        alert(`Successfully purchased ${productName}`);
                    } else if (statusRes.data.state === 'failed') {
                        clearInterval(interval);
                        setStatusMsg('Purchase failed: out of stock');
                        setProcessing(false);
                        alert(`Failed to purchase ${productName}: out of stock`);
                    }
                } catch (err) {
                    console.error(err); // Log any errors during status check
                }
            }, 2000);
        } catch (err) {
            console.error(err); // Log any errors during the order placement
            setStatusMsg('Request failed');
            setProcessing(false);
            alert('Request failed, please try again');
        }
    };

    return (
        <button
            onClick={handleFlashSale}
            disabled={processing || disabled} // Disable the button if processing or explicitly disabled
        >
            {processing ? statusMsg : 'Flash Sale Buy'}
        </button>
    );
}

// Export the FlashSaleButton component for use in other parts of the application
export default FlashSaleButton;