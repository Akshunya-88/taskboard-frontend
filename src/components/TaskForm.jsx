import React, { useState, useEffect } from 'react';
import { getAdvice } from '../api/advice';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import './TaskForm.css';

const TaskForm = ({ initialData, categories, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [suggesting, setSuggesting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                category: initialData.category || '',
                // Ensure date is in YYYY-MM-DD format if it comes differently
                due_date: initialData.due_date ? initialData.due_date.split('T')[0] : ''
            });
        }
    }, [initialData]);

    const suggest = async () => {
        if (!form.title) {
            alert("Please enter a task title first.");
            return;
        }
        setSuggesting(true);
        try {
            const selectedCategory = categories.find(c => c.id === form.category);
            const categoryName = selectedCategory ? selectedCategory.name : 'General';

            const res = await getAdvice({ title: form.title, category: categoryName });
            const advice = res.data?.advice || "Keep pushing forward!";
            setForm(prev => ({ ...prev, description: advice }));
        } catch (err) {
            console.error('Error fetching suggestion:', err);
        } finally {
            setSuggesting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form };
            if (payload.category === '') {
                payload.category = null;
            }
            if (payload.due_date === '') {
                payload.due_date = null;
            }
            await onSubmit(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Task title"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="due_date">Due Date</label>
                    <input
                        id="due_date"
                        type="date"
                        value={form.due_date}
                        onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-group">
                <div className="label-with-action">
                    <label htmlFor="description">Description</label>
                    <button
                        type="button"
                        onClick={suggest}
                        disabled={suggesting}
                        className="ai-suggest-btn"
                    >
                        <AutoAwesomeIcon fontSize="small" />
                        {suggesting ? 'Thinking...' : 'AI Suggestion'}
                    </button>
                </div>
                <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Task description"
                    rows={4}
                />
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (initialData ? 'Update Task' : 'Create Task')}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
