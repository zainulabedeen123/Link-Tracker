import React, { useState } from 'react';
import { Download, Loader2, Trash2 } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Button } from './ui/button';
import { getUserEmailCaptures, UserEmailCapture } from '../lib/api';
import { useUser } from '@clerk/clerk-react';

const ExportEmailsButton: React.FC = () => {
  const { user } = useUser();
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportAllEmails = async () => {
    if (!user?.id) return;

    try {
      setIsExporting(true);
      
      // Get all email captures for the user
      let allCaptures: UserEmailCapture[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await getUserEmailCaptures(user.id, page, 100);
        allCaptures = [...allCaptures, ...response.captures];
        hasMore = response.pagination.hasNext;
        page++;
      }

      if (allCaptures.length === 0) {
        alert('No email captures found to export.');
        return;
      }

      // Create CSV content
      const headers = [
        'Name',
        'Email', 
        'Link Title',
        'Short Code',
        'Original URL',
        'Captured At',
        'Referrer',
        'User Agent',
        'IP Address'
      ];

      const csvContent = [
        headers.join(','),
        ...allCaptures.map(capture => [
          `"${capture.name || ''}"`,
          `"${capture.email || ''}"`,
          `"${capture.linkTitle || ''}"`,
          `"${capture.shortCode || ''}"`,
          `"${capture.originalUrl || ''}"`,
          `"${formatDate(capture.capturedAt)}"`,
          `"${capture.referrer || 'Direct'}"`,
          `"${capture.userAgent || 'Unknown'}"`,
          `"${capture.ipAddress || 'Unknown'}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `all-email-captures-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`Exported ${allCaptures.length} email captures`);
      
    } catch (error) {
      console.error('Error exporting emails:', error);
      alert('Failed to export emails. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const clearEmailCache = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('email_captured_'));
    keys.forEach(key => localStorage.removeItem(key));
    alert(`Cleared ${keys.length} cached email entries. Users will see email popup again.`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={exportAllEmails}
        disabled={isExporting}
        variant="outline"
        className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            <Download className="w-4 h-4 mr-2" />
            Export All Emails
          </>
        )}
      </Button>

      <Button
        onClick={clearEmailCache}
        variant="outline"
        size="sm"
        className="bg-red-800 border-red-600 text-red-300 hover:bg-red-700 hover:text-white"
        title="Clear email cache (for testing)"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ExportEmailsButton;
