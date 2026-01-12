import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';
import Modal from '../components/Modal';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '' });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, form);
      } else {
        await createCategory(form);
      }
      setModalOpen(false);
      setForm({ name: '' });
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This might affect tasks linked to this category.')) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ name: '' });
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({ name: category.name });
    setModalOpen(true);
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div className="header-content">
          <h2>Categories</h2>
          <p>Organize your tasks with custom categories</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <AddIcon /> New Category
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          No categories found. Create one to get started!
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(cat => (
            <div key={cat.id} className="category-card group">
              <div className="category-info">
                <div className="category-icon">
                  <CategoryIcon />
                </div>
                <span className="category-name">{cat.name}</span>
              </div>

              <div className="category-actions">
                <button onClick={() => openEditModal(cat)} className="btn-icon action-btn edit">
                  <EditIcon fontSize="small" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="btn-icon action-btn delete">
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      >
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Work, Personal, Urgent"
              required
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;