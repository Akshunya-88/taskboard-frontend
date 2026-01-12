import { useEffect, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { getCategories } from '../api/categories';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filters & Pagination State
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    ordering: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        ...filters
      };
      // Remove empty filters
      Object.keys(params).forEach(key => params[key] === '' && delete params[key]);

      const res = await getTasks(params);
      // Handle different response structures (pagination vs list)
      if (res.data.results && Array.isArray(res.data.results)) {
        setTasks(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 3)); // Page size is 3
      } else if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        console.warn('Unexpected API response structure:', res.data);
        setTasks([]);
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        console.warn('Unexpected categories response:', res.data);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (data) => {
    try {
      await createTask(data);
      setModalOpen(false);
      loadTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateTask(editingTask.id, data);
      setModalOpen(false);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        loadTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'done': return 'status-badge done';
      case 'in-progress': return 'status-badge in-progress';
      default: return 'status-badge todo';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-indicator high';
      case 'medium': return 'priority-indicator medium';
      case 'low': return 'priority-indicator low';
      default: return 'priority-indicator';
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="header-content">
          <h2>Tasks</h2>
          <p>Manage your daily tasks efficiently</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <AddIcon /> New Task
        </button>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filters-group">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={filters.ordering}
            onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
          >
            <option value="">Sort By</option>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="-priority">Priority (High-Low)</option>
            <option value="priority">Priority (Low-High)</option>
            <option value="due_date">Due Date (Earliest)</option>
            <option value="-due_date">Due Date (Latest)</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="loading-state">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          No tasks found. Create one to get started!
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card group">
              <div className="task-content">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={getStatusClass(task.status)}>
                    {task.status}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span className={getPriorityClass(task.priority)}>
                    ● {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                  <span className="task-date">Due: {task.due_date || 'No date'}</span>
                  {task.category_details && (
                    <span className="category-tag">
                      {task.category_details.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="task-actions">
                <button onClick={() => openEditModal(task)} className="btn-icon action-btn edit">
                  <EditIcon />
                </button>
                <button onClick={() => handleDelete(task.id)} className="btn-icon action-btn delete">
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          className="btn btn-secondary"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="page-info">
          Page {page} of {totalPages || 1}
        </span>
        <button
          className="btn btn-secondary"
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          initialData={editingTask}
          categories={categories}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Tasks;