import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';
import EmailCollectionPopup from '../components/EmailCollectionPopup';

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<any>(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError('Invalid link');
        setLoading(false);
        return;
      }

      try {
        // Call our backend API to get link data and track the click
        const BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';
        const response = await fetch(`${BASE_URL}/r/${shortCode}`, {
          headers: {
            'x-session-id': `session_${Math.random().toString(36).substring(2, 15)}`
          }
        });

        if (!response.ok) {
          setError('Link not found or has expired');
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.success) {
          setError(data.error || 'Link not found');
          setLoading(false);
          return;
        }

        setLink(data);

        // Show email collection popup instead of immediate redirect
        setShowEmailPopup(true);

      } catch (error) {
        console.error('Redirect error:', error);
        setError('Something went wrong');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  const handleEmailSubmit = async (email: string, name: string) => {
    if (!link) return;

    try {
      setSubmittingEmail(true);

      // Submit email capture to backend
      const BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';
      await fetch(`${BASE_URL}/api/email-capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkId: link.linkId,
          shortCode: shortCode,
          email,
          name,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString()
        })
      });

      // Close popup and redirect
      setShowEmailPopup(false);

      // Small delay for better UX
      setTimeout(() => {
        window.location.href = link.originalUrl;
      }, 500);

    } catch (err) {
      console.error('Error submitting email:', err);
      // Even if email submission fails, still redirect
      setShowEmailPopup(false);
      setTimeout(() => {
        window.location.href = link.originalUrl;
      }, 500);
    } finally {
      setSubmittingEmail(false);
    }
  };

  const handleSkip = () => {
    if (link) {
      window.location.href = link.originalUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
          <p className="text-gray-400">Please wait while we redirect you to your destination</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <LinkIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-red-400">Link Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-4">
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Go to Homepage
            </a>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact the link owner.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <ExternalLink className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Redirecting to:</h1>
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-blue-400 break-all">{link?.originalUrl}</p>
          {link?.title && (
            <p className="text-gray-300 text-sm mt-2">{link.title}</p>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Please provide your details to continue
        </p>
        <button
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
        >
          Skip and continue directly
        </button>
      </div>

      {/* Email Collection Popup */}
      <EmailCollectionPopup
        isOpen={showEmailPopup}
        onClose={handleSkip}
        onSubmit={handleEmailSubmit}
        targetUrl={link?.originalUrl || ''}
        linkTitle={link?.title}
        isLoading={submittingEmail}
      />
    </div>
  );
};

export default Redirect;
