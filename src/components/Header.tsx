
import React, { useState } from 'react';
import { Menu, X, Link as LinkIcon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full flex flex-col items-center text-base justify-center px-4 py-6 max-md:px-2">
      <div className="w-full max-w-[1200px]">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[28px] text-white font-bold whitespace-nowrap text-center tracking-[-1.88px] leading-[1.1] max-md:text-[24px]">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              Linkly
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="font-normal leading-[1.7] max-md:hidden">
            <div className="flex gap-[38px]">
              <a href="#features" className="text-white hover:text-gray-300 transition-colors">
                Features
              </a>
              <a href="#integrations" className="text-white hover:text-gray-300 transition-colors">
                Integrations
              </a>
              <a href="#pricing" className="text-white hover:text-gray-300 transition-colors">
                Pricing
              </a>
              <a href="#support" className="text-white hover:text-gray-300 transition-colors">
                Support
              </a>
            </div>
          </nav>

          {/* Desktop Buttons */}
          <div className="font-semibold max-md:hidden">
            <div className="flex items-center gap-[17px]">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-white gap-1 py-2.5 px-4 rounded-lg hover:bg-white/10 transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Try it Free
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-[rgba(33,33,43,0.95)] backdrop-blur-md rounded-lg p-4 border border-white/10">
            <nav className="flex flex-col gap-4 mb-4">
              <a
                href="#features"
                className="text-white hover:text-gray-300 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#integrations"
                className="text-white hover:text-gray-300 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Integrations
              </a>
              <a
                href="#pricing"
                className="text-white hover:text-gray-300 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#support"
                className="text-white hover:text-gray-300 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </a>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-white gap-1 py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-center">
                    Log in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-center">
                    Try it Free
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
