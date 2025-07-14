import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLinkByShortCode, trackClick } from '../lib/api';
import { trackLinkClick } from '../lib/tracking';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<any>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError('Invalid link');
        setLoading(false);
        return;
      }

      try {
        // Get the link from our database
        const foundLink = await getLinkByShortCode(shortCode);
        
        if (!foundLink) {
          setError('Link not found or has expired');
          setLoading(false);
          return;
        }

        setLink(foundLink);

        // Track the click
        const clickData = await trackLinkClick(shortCode);
        await trackClick(foundLink.id, clickData);

        // Redirect after a short delay to ensure tracking completes
        setTimeout(() => {
          window.location.href = foundLink.originalUrl;
        }, 500);

      } catch (error) {
        console.error('Redirect error:', error);
        setError('Something went wrong');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

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
        </div>
        <p className="text-gray-400 text-sm mb-4">
          If you're not redirected automatically, click the button below:
        </p>
        <a
          href={link?.originalUrl}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Continue to Destination
        </a>
      </div>
    </div>
  );
};

export default Redirect;
