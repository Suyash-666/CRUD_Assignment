import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import Alert from '../components/Alert';
import Navbar from '../components/Navbar';

export default function DashboardPage({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [stats, setStats] = useState(null);

  // Fetch tasks on mount and when filters change
  useEffect(() => {
    fetchTasks();
    if (user.role === 'admin') {
      fetchStats();
    }
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks(filters);
      setTasks(response.data.data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch tasks',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await taskAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setAlert({
        type: 'error',
        message: 'Please enter a task title',
      });
      return;
    }

    try {
      const response = await taskAPI.createTask(formData);
      setTasks([response.data.data, ...tasks]);
      setFormData({ title: '', description: '', priority: 'medium' });
      setShowCreateForm(false);
      setAlert({
        type: 'success',
        message: 'Task created successfully!',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create task',
      });
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      const response = await taskAPI.updateTask(editingTask._id, formData);
      setTasks(
        tasks.map((task) => (task._id === editingTask._id ? response.data.data : task))
      );
      setEditingTask(null);
      setFormData({ title: '', description: '', priority: 'medium' });
      setAlert({
        type: 'success',
        message: 'Task updated successfully!',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update task',
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      setAlert({
        type: 'success',
        message: 'Task deleted successfully!',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete task',
      });
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });
    setShowCreateForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">📋 My Tasks</h1>
            <button
              onClick={() => {
                setEditingTask(null);
                setFormData({ title: '', description: '', priority: 'medium' });
                setShowCreateForm(!showCreateForm);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              {showCreateForm ? '✕ Cancel' : '+ New Task'}
            </button>
          </div>

          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}

          {/* Statistics for Admin */}
          {user.role === 'admin' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
                <p className="text-sm opacity-80">Total Tasks</p>
                <p className="text-3xl font-bold">{stats.stats.totalTasks}</p>
              </div>
              <div className="bg-green-500 text-white p-4 rounded-lg shadow">
                <p className="text-sm opacity-80">Completed</p>
                <p className="text-3xl font-bold">{stats.stats.completedTasks}</p>
              </div>
              <div className="bg-yellow-500 text-white p-4 rounded-lg shadow">
                <p className="text-sm opacity-80">In Progress</p>
                <p className="text-3xl font-bold">{stats.stats.inProgressTasks}</p>
              </div>
              <div className="bg-red-500 text-white p-4 rounded-lg shadow">
                <p className="text-sm opacity-80">Pending</p>
                <p className="text-3xl font-bold">{stats.stats.pendingTasks}</p>
              </div>
            </div>
          )}

          {/* Create/Edit Task Form */}
          {showCreateForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <form
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter task title"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter task description (optional)"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {editingTask && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editingTask.status}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            status: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg">
              <p className="text-gray-600">No tasks found. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
