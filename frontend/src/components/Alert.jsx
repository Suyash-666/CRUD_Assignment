export default function Alert({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';

  return (
    <div
      className={`border-l-4 ${borderColor} ${bgColor} ${textColor} p-4 rounded mb-4`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl font-bold cursor-pointer opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
