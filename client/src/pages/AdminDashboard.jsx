import { useState } from 'react';
import ProductManagement from '../components/ProductManagement';
import CategoryManagement from '../components/CategoryManagement';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products'); // Track the active admin dashboard tab

  return (
    <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <div className="admin-tabs">
            <button
                className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
            >
                Products
            </button>
            <button
                className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
            >
                Categories
            </button>
        </div>
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
    </div>
  );
}

export default AdminDashboard;