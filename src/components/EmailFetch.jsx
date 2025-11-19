import EmailList from './EmailList';
import EmailBody from './EmailBody';
import FilterButtons from './FilterButtons';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const EmailFetch = () => {
        const [emails, setEmails] = useState([]);
        const [selectedEmail, setSelectedEmail] = useState(null);
        const [filter, setFilter] = useState('all');
        const [readEmails, setReadEmails] = useState(new Set());
        const [favoriteEmails, setFavoriteEmails] = useState(new Set());
        const [trashEmails, setTrashEmails] = useState(new Set());
        const [loading, setLoading] = useState(true);
        const [searchQuery, setSearchQuery] = useState('');
      
        useEffect(() => {
          const savedRead = localStorage.getItem('readEmails');
          const savedFavorites = localStorage.getItem('favoriteEmails');
          const savedTrash = localStorage.getItem('trashEmails');
      
          if (savedRead) setReadEmails(new Set(JSON.parse(savedRead)));
          if (savedFavorites) setFavoriteEmails(new Set(JSON.parse(savedFavorites)));
          if (savedTrash) setTrashEmails(new Set(JSON.parse(savedTrash)));
      
          fetchEmails();
        }, []);
        useEffect(() => {
            localStorage.setItem('trashEmails', JSON.stringify([...trashEmails]));
        }, [trashEmails]);

      
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
          const noReplyPatterns = ['noreply', 'no-reply', 'donotreply', 'do-not-reply', 'notification'];
          return noReplyPatterns.some(pattern =>
            senderEmail.toLowerCase().includes(pattern) || senderName.toLowerCase().includes(pattern)
          );
        };

        const deleteEmail = (emailId) =>{
          const newTrash = new Set(trashEmails);
          newTrash.add(emailId);
          setTrashEmails(newTrash);
          localStorage.setItem('trashEmails', JSON.stringify([...newTrash]));
        }

        const restoreFromTrash = (emailId) =>{
          const newTrash = new Set(trashEmails);
          newTrash.delete(emailId); 
          setTrashEmails(newTrash);
          localStorage.setItem('trashEmails', JSON.stringify([...newTrash]));
        }

        const emptyTrash = () => {
          const newTrash = new Set();
          setTrashEmails(newTrash);
          localStorage.setItem('trashEmails', JSON.stringify([...newTrash]));
        }

        const filteredEmails = emails.filter(email => {
          if (filter !== 'trash' && trashEmails.has(email.id)) return false;
          if (filter === 'favorites') return favoriteEmails.has(email.id);
          if (filter === 'read') return readEmails.has(email.id);
          if (filter === 'unread') return !readEmails.has(email.id);
          if (filter === 'no-reply') return isNoReplyEmail(email);
          if (filter === 'trash') return trashEmails.has(email.id);
          if (filter === 'readAll') return true;
          if (filter === 'important') return favoriteEmails.has(email.id) || !isNoReplyEmail(email);
          if (filter === 'unreadAll') return !readEmails.has(email.id);
          return true;
        }).filter(email => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          const subject = email.subject?.toLowerCase() || '';
          const senderName = email.from?.name?.toLowerCase() || '';
          const senderEmail = email.from?.email?.toLowerCase() || '';
          const preview = email.preview?.toLowerCase() || '';
          
          return subject.includes(query) || senderName.includes(query) || senderEmail.includes(query) || preview.includes(query);
        });
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Mailbox</h1>
            <div className="text-sm text-gray-600">
              {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by subject, sender, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <X className='absolute right-3 top-3 text-gray-400 cursor-pointer'
                onClick={() => setSearchQuery('')} size={20} />
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <FilterButtons currentFilter={filter} onFilterChange={setFilter}/>

        <div className="flex gap-6 mt-6">
          <div className={`${selectedEmail ? 'w-1/3' : 'w-full'} transition-all`}>
            <EmailList
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              readEmails={readEmails}
              favoriteEmails={favoriteEmails}
              onEmailClick={handleEmailClick}
              onDelete={deleteEmail}
              onRestore={restoreFromTrash}
              onEmptyTrash={emptyTrash}
              currentFilter={filter}
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
                onDeleteEmail={deleteEmail}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailFetch
