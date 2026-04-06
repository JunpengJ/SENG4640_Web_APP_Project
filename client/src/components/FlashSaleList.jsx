import { useState, useEffect } from "react";
import { getFlashSales } from "../api";
import ProductCard from "./ProductCard";

function FlashSaleList() {
    const [flashSales, setFlashSales] = useState([]); // State to store flash sale data
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        fetchFlashSales(); // Fetch flash sales when the component mounts
    }, []);

    const fetchFlashSales = async () => {
        try {
            const res = await getFlashSales(); // Fetch flash sale data from the API
            setFlashSales(res.data);
        } catch (error) {
            console.error(error); // Log any errors during the fetch
        } finally {
            setLoading(false); // Set loading to false after the fetch completes
        }
    };

    if (loading) return <div>Loading flash sales...</div>; // Display loading message while fetching data

    return (
        <div>
            <h2>Flash Sale</h2>
            <div className="products">
                {flashSales.map((sale) => (
                    <ProductCard 
                        key={sale._id} // Unique key for each product card
                        product={sale.productId} // Pass product data to the ProductCard component
                        flashSale={sale} // Pass flash sale data to the ProductCard component
                    />
                ))}
            </div>
        </div>
    );
}

// Export the FlashSaleList component for use in other parts of the application
export default FlashSaleList;