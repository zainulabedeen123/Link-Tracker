
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "What is Linkly and how does it work?",
      answer: "Linkly is a powerful link tracking and management platform that allows you to create short, branded links with advanced analytics. Simply paste your long URL, customize your short link, and start tracking clicks, geographic data, device information, and more."
    },
    {
      question: "Can I use my own custom domain?",
      answer: "Yes! Linkly supports custom domains so you can create branded short links using your own domain name. This helps maintain brand consistency and builds trust with your audience."
    },
    {
      question: "What kind of analytics does Linkly provide?",
      answer: "Linkly provides comprehensive analytics including click counts, geographic location data, device and browser information, referrer sources, and time-based analytics. You can also export data to CSV or integrate with Google Sheets."
    },
    {
      question: "How does geo-targeting work?",
      answer: "Geo-targeting allows you to redirect users to different destinations based on their geographic location. For example, you can send US visitors to your US store and UK visitors to your UK store, all using the same short link."
    },
    {
      question: "Is there a free plan available?",
      answer: "Yes! Linkly offers a free plan that includes 1,000 monthly clicks with all core features including analytics, QR codes, and custom short links. No credit card required to get started."
    }
  ];

  return (
    <section className="w-full max-w-[1200px] mt-[134px] px-4 max-md:mt-10 max-md:px-2">
      <div className="flex flex-col justify-start items-center gap-20">
        <div className="self-stretch flex flex-col justify-start items-center gap-6">
          <div className="self-stretch text-center text-white text-5xl font-bold leading-[60px] tracking-[-1.5px] max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px]">
            Frequently Asked Questions
          </div>
          <div className="w-full max-w-[633px] opacity-80 text-center text-[#AAA] text-lg font-normal leading-[30.6px] max-md:text-base max-md:leading-[24px]">
            Get answers to common questions about Linkly's link tracking and management features.
          </div>
        </div>
        <div className="self-stretch">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b border-[rgba(255,255,255,0.15)]"
              >
                <AccordionTrigger className="text-left text-white text-xl font-bold leading-[34px] py-8 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#AAA] text-base font-normal leading-[27.2px] pb-8 pt-0">
                  <div className="p-6 rounded-2xl">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
