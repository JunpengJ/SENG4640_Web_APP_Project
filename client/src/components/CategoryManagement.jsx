import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api';

function CategoryManagement() {
    const [categories, setCategories] = useState([]); // Stored list of categories
    const [editing, setEditing] = useState(null); // ID of category currently being edited
    const [form, setForm] = useState({ name: '', slug: '', description: '' }); // Form state for category fields

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateCategory(editing, form);
            } else {
                await createCategory(form);
            }
            setForm({ name: '', slug: '', description: '' });
            setEditing(null);
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert('Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                await deleteCategory(id);
                fetchCategories();
            } catch (err) {
                console.error(err);
                alert('Failed to delete');
            }
        }
    };

    const handleEdit = (cat) => {
        setEditing(cat._id);
        setForm({ name: cat.name, slug: cat.slug, description: cat.description });
    };

    return (
        <div>
            <h2>Category Management</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
                <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
                <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <button type="submit">{editing ? 'Update' : 'Create'}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', slug: '', description: '' }); }}>Cancel</button>}
            </form>
            <table border="1" cellPadding="8" style={{ width: '100%' }}>
                <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
                <tbody>
                    {categories.map(c => (
                        <tr key={c._id}>
                            <td>{c.name}</td>
                            <td>{c.slug}</td>
                            <td>
                                <button onClick={() => handleEdit(c)}>Edit</button>
                                <button onClick={() => handleDelete(c._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoryManagement;