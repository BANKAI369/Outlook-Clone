import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

function EmailBody({emails, emailId, isFavorite, onToggleFavorite}) {  
  const [emailData, setEmailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmailBody();
  }, [emailId, emails]); 

  const fetchEmailBody = async () => {
    try {
      setLoading(true);
      const emailFromList = emails?.find(e => e.id === emailId);

      const response = await fetch(`https://flipkart-email-mock.now.sh/?id=${emailId}`);
      const bodyData = await response.json();
      const merged = {
        ...emailFromList,
        ...bodyData,
        from: emailFromList?.from || { name: 'Unknown Sender', email: '' },
        subject: emailFromList?.subject || 'No Subject',
        date: emailFromList?.date
      };
      
      setEmailData(merged);
    } catch (error) {
      console.error('Error fetching email body:', error);
    } finally {
      setLoading(false);
    }
  };

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
    if (!name || typeof name !== 'string') return '';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center h-full">
        <p className="text-gray-500">Loading email...</p>
      </div>
    );
  }

  if (!emailData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center h-full">
        <p className="text-gray-500">Failed to load email</p>
      </div>
    );
  }

  const senderName = emailData?.from?.name || emailData?.from?.email || 'Unknown Sender';
  const senderInitials = getInitial(senderName);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-medium ${
              isFavorite ? 'bg-yellow-400' : 'bg-pink-500'
            }`}>
              {senderInitials}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{senderName}</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{emailData.subject}</h2>
            <p className="text-sm text-gray-500">{emailData.date ? formatDate(emailData.date) : 'Unknown date'}</p>
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite(emailId)}
          className="flex-shrink-0 ml-4 transition-all hover:scale-110"
        >
          <Star
            size={28}
            className={`transition-colors ${
              isFavorite
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          />
        </button>
      </div>
      <div
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: emailData.body }}
      />
    </div>
  );
}

export default EmailBody;
