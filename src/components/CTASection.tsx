
import React from 'react';

export const CTASection: React.FC = () => {
  return (
    <section className="border-[color:var(--stroke-15-card,rgba(255,255,255,0.40))] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] backdrop-blur-[50px] bg-[rgba(116,116,116,0.07)] w-full max-w-[1200px] overflow-hidden mt-[134px] mx-4 rounded-[32px] border-[1.5px] border-solid max-md:mt-10 max-md:mx-2">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className="w-6/12 max-md:w-full max-md:ml-0">
          <div className="self-stretch my-auto px-[60px] py-8 max-md:px-6 max-md:py-6 max-md:mt-10">
            <div className="w-full">
              <h2 className="text-white text-5xl font-medium leading-[58px] tracking-[-1.5px] max-md:text-[28px] max-md:leading-[36px] max-md:tracking-[-1px]">
                Unlock Your Image Editing Potential with AI
              </h2>
              <p className="text-[#f8f8f8] text-base font-normal leading-[1.7] opacity-80 mt-4 max-md:text-sm max-md:leading-[22px]">
                Start Your Journey with and Revolutionize Your Creative
                Process
              </p>
            </div>
            <div className="w-full max-w-[182px] text-base text-white font-bold leading-[1.7] mt-10 rounded-[100px] max-md:mt-6">
              <button className="text-white w-full border-[color:var(--Linear,#FF5552)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px] min-h-[58px] gap-3 overflow-hidden px-7 py-4 rounded-[100px] border-[1.5px] border-solid max-md:px-5 max-md:min-h-[50px] max-md:text-sm hover:bg-[rgba(33,33,43,0.80)] transition-colors">
                Book a Demo
              </button>
            </div>
          </div>
        </div>
        <div className="w-6/12 max-md:w-full max-md:ml-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/d161b852c3d5e5e0986ff12ae5863ac088519d5d?placeholderIfAbsent=true"
            className="aspect-[1.31] object-contain w-full grow max-md:max-w-full max-md:h-auto"
            alt="AI Finance Platform Demo"
          />
        </div>
      </div>
    </section>
  );
};
