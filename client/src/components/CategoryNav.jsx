import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../api';

function CategoryNav() {
    const [categories, setCategories] = useState([]); // Stored category list for navigation
    const navigate = useNavigate(); // React Router navigation hook

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCategoryClick = (catId) => {
        navigate(`/?category=${catId}`);
    };

    return (
        <div className="category-nav">
            <span className="category-title">Categories:</span>
            <div className="category-list">
                <button onClick={() => navigate('/')}>All</button>
                {categories.map(cat => (
                    <button key={cat._id} onClick={() => handleCategoryClick(cat._id)}>
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryNav;