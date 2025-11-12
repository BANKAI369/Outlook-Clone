import { Star } from 'lucide-react';

function EmailItem({ email, isSelected, isRead, isFavorite, onClick }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
  };

  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      onClick={onClick}
      className={`flex gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
        isFavorite
          ? 'border-yellow-300 bg-yellow-50'
          : isSelected
          ? 'border-red-400 bg-white'
          : isRead
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-300 bg-white'
      } hover:shadow-md`}
    >
      <div className="flex-shrink-0">
        <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-medium ${
          isFavorite ? 'bg-yellow-400' : 'bg-pink-500'
        }`}>
          {getInitial(email.from.name)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm text-gray-600">
            From: <span className="font-semibold text-gray-800">{email.from.name}</span>{' '}
            <span className="text-gray-500">&lt;{email.from.email}&gt;</span>
          </p>
          {isFavorite && (
            <Star size={18} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
          )}
        </div>

        <div className="mb-1">
          <p className="text-sm text-gray-600">
            Subject: <span className="font-semibold text-gray-800">{email.subject}</span>
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{email.short_description}</p>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-500">{formatDate(email.date)}</span>
        </div>
      </div>
    </div>
  );
}

export default EmailItem;
