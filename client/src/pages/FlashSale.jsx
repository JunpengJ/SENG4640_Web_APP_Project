import FlashSaleList from '../components/FlashSaleList';

function FlashSale() {
    return (
        <div>
            {/* Display the title for the flash sale page */}
            <h2 className="flash-sale-title">🔥 Flash Sale 🔥</h2>
            {/* Render the FlashSaleList component */}
            <FlashSaleList />
        </div>
    );
}

// Export the FlashSale component for use in other parts of the application
export default FlashSale;