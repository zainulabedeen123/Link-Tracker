
import React from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[1200px] mt-32 px-4 max-md:mt-20 max-md:px-2">
      <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl border border-gray-700 p-16 text-center max-md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
            Track 1000 monthly clicks with all features included
          </div>

          <h2 className="text-white text-5xl font-bold leading-[58px] tracking-[-1.5px] mb-6 max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px]">
            Ready to Start Tracking Your Links?
          </h2>

          <p className="text-gray-300 text-xl leading-relaxed mb-8 max-md:text-lg">
            Join thousands of businesses using Linkly to create tracking links, retarget visitors, and optimize their marketing campaigns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors min-w-[200px]">
                  Get Started for Free
                </button>
              </SignInButton>
              <p className="text-gray-400 text-sm">No credit card required</p>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors min-w-[200px]"
              >
                Start Creating Links
              </button>
            </SignedIn>
          </div>
        </div>
      </div>
    </section>
  );
};
