
import React from 'react';
import { Facebook, Twitter, Youtube, Link as LinkIcon } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-[1200px] mt-[134px] px-4 max-md:mt-10 max-md:px-2">
      <div className="w-full overflow-hidden flex flex-col justify-start items-center gap-10">
        <div className="flex flex-col justify-start items-start gap-12">
          <div className="w-full max-w-[1200px] justify-between items-start flex max-lg:flex-col max-lg:gap-12 max-md:gap-8">
            <div className="w-[352px] max-lg:w-full max-md:w-full flex flex-col justify-start items-start gap-8">
              <div className="flex items-center gap-3 text-[28px] text-white font-bold whitespace-nowrap text-center tracking-[-1.88px] leading-[1.1] max-md:text-[24px]">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  Linkly
                </div>
              </div>
              <div className="w-full max-w-[352px] opacity-80 text-[#AAA] text-lg font-normal leading-[30.6px] max-md:text-base max-md:leading-[24px]">
                Create simple, beautiful and branded link trackers with smart redirects, retargeting pixels, QR codes and more.
              </div>
              <div className="justify-start items-start gap-6 flex">
                <Facebook className="w-5 h-5 text-white hover:text-gray-300 transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 text-white hover:text-gray-300 transition-colors cursor-pointer" />
                <Youtube className="w-5 h-5 text-white hover:text-gray-300 transition-colors cursor-pointer" />
              </div>
            </div>
            <div className="w-40 max-lg:w-full max-md:w-full flex flex-col justify-start items-start gap-9 max-lg:flex-row max-lg:justify-between max-md:flex-col max-md:gap-8">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="text-white text-base font-bold leading-[27.2px]">LINKLY</div>
                <div className="flex flex-col justify-start items-start gap-4">
                  <a href="#features" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Features</a>
                  <a href="#pricing" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Pricing</a>
                  <a href="#competitors" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Competitors</a>
                  <a href="#contact" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Contact</a>
                </div>
              </div>
            </div>
            <div className="w-40 max-lg:w-full max-md:w-full flex flex-col justify-start items-start gap-9 max-lg:flex-row max-lg:justify-between max-md:flex-col max-md:gap-8">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="text-white text-base font-bold leading-[27.2px]">Guides</div>
                <div className="flex flex-col justify-start items-start gap-4">
                  <a href="#tracking-links" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Tracking Links</a>
                  <a href="#link-rotators" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Link Rotators</a>
                  <a href="#branded-shortlinks" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Branded Shortlinks</a>
                  <a href="#blog" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Blog</a>
                </div>
              </div>
            </div>
            <div className="w-40 max-lg:w-full max-md:w-full flex flex-col justify-start items-start gap-9 max-lg:flex-row max-lg:justify-between max-md:flex-col max-md:gap-8">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="text-white text-base font-bold leading-[27.2px]">Legal</div>
                <div className="flex flex-col justify-start items-start gap-4">
                  <a href="#terms" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Terms of Use</a>
                  <a href="#privacy" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
                  <a href="#gdpr" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">GDPR</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1200px] py-3 border-t border-white/15 justify-center items-center flex max-md:text-center">
          <div className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] max-md:text-sm">
            © Linkly All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
