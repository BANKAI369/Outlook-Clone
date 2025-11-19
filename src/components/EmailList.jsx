import EmailItem from './EmailItem';

function EmailList({
  emails,
  selectedEmail,
  readEmails,
  favoriteEmails,
  onEmailClick,
  onDelete,
  onRestore,
  currentFilter,
  loading,
  onEmptyTrash
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading emails...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No emails found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentFilter === 'trash' && (
        <button onClick={onEmptyTrash} className="mb-4 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white">Empty Trash</button>
      )}
      {emails.map(email => (
        <EmailItem
          key={email.id}
          email={email}
          isSelected={selectedEmail === email.id}
          isRead={readEmails.has(email.id)}
          isFavorite={favoriteEmails.has(email.id)}
          onClick={() => onEmailClick(email.id)}
          onDelete={onDelete}
          onRestore={onRestore}
          currentFilter={currentFilter}

        />
      ))}
    </div>
  );
}

export default EmailList;
