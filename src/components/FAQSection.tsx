
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
      question: "What is an AI Image Editor?",
      answer: "An AI Image Editor uses artificial intelligence to automatically enhance, retouch, and apply creative effects to your photos, making image editing faster and easier."
    },
    {
      question: "How does the AI improve my photos?",
      answer: "Our AI analyzes your photos and automatically applies enhancements like color correction, noise reduction, sharpening, and intelligent cropping to make your images look their best."
    },
    {
      question: "Is my data safe when I upload images?",
      answer: "Yes, we prioritize your privacy and security. All uploaded images are encrypted during transfer and processing, and we never store your images permanently on our servers."
    },
    {
      question: "Can I manually adjust the edits made by the AI?",
      answer: "Absolutely! While our AI provides intelligent automatic edits, you have full control to fine-tune any adjustments, add your own creative touches, or revert changes as needed."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a free trial that allows you to test all our features with a limited number of image edits. No credit card required to get started."
    }
  ];

  return (
    <section className="w-full max-w-[1200px] mt-[134px] px-4 max-md:mt-10 max-md:px-2">
      <div className="flex flex-col justify-start items-center gap-20">
        <div className="self-stretch flex flex-col justify-start items-center gap-6">
          <div className="self-stretch text-center text-white text-6xl font-medium leading-[72px] tracking-[-1.5px] max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px]">
            Frequently Asked Questions
          </div>
          <div className="w-full max-w-[633px] opacity-80 text-center text-[#AAA] text-lg font-normal leading-[30.6px] max-md:text-base max-md:leading-[24px]">
            Discover the future of music production with SonifyAI. Effortlessly create, edit, and perfect your tracks.
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
