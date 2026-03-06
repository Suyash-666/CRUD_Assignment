export default function TaskCard({ task, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      default:
        return 'text-green-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 break-words">
          {task.title}
        </h3>
        <span
          className={`text-sm px-2 py-1 rounded whitespace-nowrap ml-2 ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-2 break-words">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
          Priority: {task.priority.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500">
          Created: {formatDate(task.createdAt)}
        </span>
      </div>

      {task.createdBy && (
        <p className="text-xs text-gray-500 mb-3">By: {task.createdBy.name}</p>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
