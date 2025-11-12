import EmailItem from './EmailItem';

function EmailList({
  emails,
  selectedEmail,
  readEmails,
  favoriteEmails,
  onEmailClick,
  loading,
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
      {emails.map(email => (
        <EmailItem
          key={email.id}
          email={email}
          isSelected={selectedEmail === email.id}
          isRead={readEmails.has(email.id)}
          isFavorite={favoriteEmails.has(email.id)}
          onClick={() => onEmailClick(email.id)}
        />
      ))}
    </div>
  );
}

export default EmailList;
