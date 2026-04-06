import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api';

function ProductManagement() {
  const [products, setProducts] = useState([]); // Stored product list in admin panel
  const [editing, setEditing] = useState(null); // ID of product currently being edited
  const [form, setForm] = useState({ name: '', description: '', price: '', categories: [], images: [], inventory: { total: 0, available: 0 } }); // Form state for product data

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
        const res = await getProducts();
        setProducts(res.data.products || res.data);
    } catch (err) {
        console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editing) {
            await updateProduct(editing, form);
        } else {
            await createProduct(form);
        }
        setForm({ name: '', description: '', price: '', categories: [], images: [], inventory: { total: 0, available: 0 } });
        setEditing(null);
        fetchProducts();
    } catch (err) {
        console.error(err);
        alert('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Failed to delete');
        }
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        categories: product.categories.map(c => c._id || c),
        images: product.images,
        inventory: product.inventory
    });
  };

  return (
    <div>
        <h2>Product Management</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <input placeholder="Categories (comma separated IDs)" value={form.categories.join(',')} onChange={e => setForm({ ...form, categories: e.target.value.split(',').map(s => s.trim()) })} />
            <input placeholder="Image URL" value={form.images[0] || ''} onChange={e => setForm({ ...form, images: [e.target.value] })} />
            <input type="number" placeholder="Total Stock" value={form.inventory.total} onChange={e => setForm({ ...form, inventory: { ...form.inventory, total: parseInt(e.target.value), available: parseInt(e.target.value) } })} />
            <button type="submit">{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', categories: [], images: [], inventory: { total: 0, available: 0 } }); }}>Cancel</button>}
        </form>
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
            <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
                {products.map(p => (
                    <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>${p.price}</td>
                        <td>{p.inventory?.available}</td>
                        <td>
                            <button onClick={() => handleEdit(p)}>Edit</button>
                            <button onClick={() => handleDelete(p._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}

export default ProductManagement;