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
        // Get link data first (without tracking)
        const BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
        const response = await fetch(`${BASE_URL}/links/by-code/${shortCode}`);

        if (!response.ok) {
          setError('Link not found or has expired');
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Link data received:', data);

        if (!data.success) {
          setError(data.error || 'Link not found');
          setLoading(false);
          return;
        }

        // Set link data and track the click
        setLink(data.link);

        // Track the click now
        await fetch(`${BASE_URL.replace('/api', '')}/r/${shortCode}`, {
          headers: {
            'x-session-id': `session_${Math.random().toString(36).substring(2, 15)}`
          }
        }).catch(err => console.log('Tracking error:', err));

        setLoading(false);

        // Check if email was already captured for this link
        const cacheKey = `email_captured_${shortCode}`;
        const cachedEmail = localStorage.getItem(cacheKey);

        if (cachedEmail) {
          console.log('Email already captured, skipping popup');
          // Redirect immediately if email was already captured
          setTimeout(() => {
            window.location.href = data.link.originalUrl;
          }, 1000);
        } else {
          // Show email collection popup
          console.log('Showing email popup');
          setShowEmailPopup(true);
        }

      } catch (error) {
        console.error('Redirect error:', error);
        setError('Failed to load link');
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
      const BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
      console.log('Submitting email capture:', { linkId: link.id, email, name });

      const response = await fetch(`${BASE_URL}/email-capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkId: link.id,
          shortCode: shortCode,
          email,
          name,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      console.log('Email capture response:', result);

      if (response.ok && result.success) {
        // Store email in localStorage to prevent showing popup again
        const cacheKey = `email_captured_${shortCode}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          email,
          name,
          timestamp: new Date().toISOString()
        }));
        console.log('Email cached for future visits');
      } else {
        console.error('Email capture failed:', result.error);
      }

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
      {console.log('Rendering popup with:', { showEmailPopup, link })}
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
