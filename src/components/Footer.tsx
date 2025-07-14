
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-[1200px] mt-[134px] px-4 max-md:mt-10 max-md:px-2">
      <div className="w-full overflow-hidden flex flex-col justify-start items-center gap-10">
        <div className="flex flex-col justify-start items-start gap-12">
          <div className="w-full max-w-[1200px] justify-between items-start flex max-lg:flex-col max-lg:gap-12 max-md:gap-8">
            <div className="w-[352px] max-lg:w-full max-md:w-full flex flex-col justify-start items-start gap-8">
              <div className="flex items-center gap-3 text-[28px] text-white font-medium whitespace-nowrap text-center tracking-[-1.88px] leading-[1.1] max-md:text-[24px]">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/e4bfb5a3f9037dab7d49b7c2771e5de52593d8aa?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-10 shrink-0"
                  alt="Webfluin Logo"
                />
                <div className="text-white">
                  Webfluin
                </div>
              </div>
              <div className="w-full max-w-[352px] opacity-80 text-[#AAA] text-lg font-normal leading-[30.6px] max-md:text-base max-md:leading-[24px]">
                Discover the future of music production with SonifyAI. Effortlessly create, edit, and perfect your tracks.
              </div>
              <div className="justify-start items-start gap-6 flex">
                <Facebook className="w-5 h-5 text-white hover:text-gray-300 transition-colors cursor-pointer" />
                <Instagram className="w-5 h-5 text-white hover:text-gray-300 transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 text-white hover:text-gray-300 transition-colors cursor-pointer" />
                <Linkedin className="w-5 h-5 text-white hover:text-gray-300 transition-colors cursor-pointer" />
              </div>
            </div>
            <div className="w-40 max-lg:w-full max-md:w-full flex flex-col justify-start items-start gap-9 max-lg:flex-row max-lg:justify-between max-md:flex-col max-md:gap-8">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="text-white text-base font-bold leading-[27.2px]">Menu</div>
                <div className="flex flex-col justify-start items-start gap-4">
                  <a href="#home" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Home</a>
                  <a href="#features" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Features</a>
                  <a href="#pricing" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Pricing</a>
                  <a href="#contact" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Contact Us</a>
                </div>
              </div>
            </div>
            <div className="w-40 max-lg:w-full max-md:w-full flex flex-col justify-start items-start gap-9 max-lg:flex-row max-lg:justify-between max-md:flex-col max-md:gap-8">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="text-white text-base font-bold leading-[27.2px]">Info</div>
                <div className="flex flex-col justify-start items-start gap-4">
                  <a href="#terms" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Terms</a>
                  <a href="#privacy" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
                  <a href="#support" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Support</a>
                </div>
              </div>
            </div>
            <div className="w-40 max-lg:w-full max-md:w-full flex flex-col justify-start items-start gap-9 max-lg:flex-row max-lg:justify-between max-md:flex-col max-md:gap-8">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="text-white text-base font-bold leading-[27.2px]">Resources</div>
                <div className="flex flex-col justify-start items-start gap-4">
                  <a href="#blogs" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Blogs</a>
                  <a href="#testimonials" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Testimonials</a>
                  <a href="#brand-guide" className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] hover:text-white transition-colors cursor-pointer">Brand Guide</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1200px] py-3 border-t border-white/15 justify-center items-center flex max-md:text-center">
          <div className="opacity-80 text-[#AAA] text-base font-normal leading-[27.2px] max-md:text-sm">
            Copyright © 2024 Webfluin. All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
