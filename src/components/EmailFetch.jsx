import EmailList from './EmailList';
import EmailBody from './EmailBody';
import FilterButtons from './FilterButtons';
import { useState, useEffect } from 'react';

const EmailFetch = () => {
        const [emails, setEmails] = useState([]);
        const [selectedEmail, setSelectedEmail] = useState(null);
        const [filter, setFilter] = useState('all');
        const [readEmails, setReadEmails] = useState(new Set());
        const [favoriteEmails, setFavoriteEmails] = useState(new Set());
        const [loading, setLoading] = useState(true);
      
        useEffect(() => {
          const savedRead = localStorage.getItem('readEmails');
          const savedFavorites = localStorage.getItem('favoriteEmails');
      
          if (savedRead) setReadEmails(new Set(JSON.parse(savedRead)));
          if (savedFavorites) setFavoriteEmails(new Set(JSON.parse(savedFavorites)));
      
          fetchEmails();
        }, []);
      
        const fetchEmails = async () => {
          try {
            setLoading(true);
            const response = await fetch('https://flipkart-email-mock.now.sh/');
            const data = await response.json();
            setEmails(data.list || []);
          } catch (error) {
            console.error('Error fetching emails:', error);
          } finally {
            setLoading(false);
          }
        };
      
        const handleEmailClick = (emailId) => {
          setSelectedEmail(emailId);
          const newReadEmails = new Set(readEmails);
          newReadEmails.add(emailId);
          setReadEmails(newReadEmails);
          localStorage.setItem('readEmails', JSON.stringify([...newReadEmails]));
        };
      
        const toggleFavorite = (emailId) => {
          const newFavorites = new Set(favoriteEmails);
          if (newFavorites.has(emailId)) {
            newFavorites.delete(emailId);
          } else {
            newFavorites.add(emailId);
          }
          setFavoriteEmails(newFavorites);
          localStorage.setItem('favoriteEmails', JSON.stringify([...newFavorites]));
        };

        const isNoReplyEmail = (email) => {
          const senderEmail = email.from?.email || '';
          const senderName = email.from?.name || '';
          // Check for common no-reply patterns
          const noReplyPatterns = ['noreply', 'no-reply', 'donotreply', 'do-not-reply', 'notification'];
          return noReplyPatterns.some(pattern =>
            senderEmail.toLowerCase().includes(pattern) || senderName.toLowerCase().includes(pattern)
          );
        };

        const filteredEmails = emails.filter(email => {
          if (filter === 'favorites') return favoriteEmails.has(email.id);
          if (filter === 'read') return readEmails.has(email.id);
          if (filter === 'unread') return !readEmails.has(email.id);
          if (filter === 'no-reply') return isNoReplyEmail(email);
          return true;
        });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <FilterButtons currentFilter={filter} onFilterChange={setFilter} />

        <div className="flex gap-6 mt-6">
          <div className={`${selectedEmail ? 'w-1/3' : 'w-full'} transition-all`}>
            <EmailList
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              readEmails={readEmails}
              favoriteEmails={favoriteEmails}
              onEmailClick={handleEmailClick}
              loading={loading}
            />
          </div>

          {selectedEmail && (
            <div className="w-2/3">
              <EmailBody
                emails={emails}
                emailId={selectedEmail}
                isFavorite={favoriteEmails.has(selectedEmail)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailFetch
