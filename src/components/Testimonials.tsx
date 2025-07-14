
import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, avatar }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.article 
      className="justify-center items-center border-[color:var(--stroke-15-card,rgba(255,255,255,0.40))] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] backdrop-blur-[50px] bg-[rgba(116,116,116,0.07)] flex min-w-60 flex-col overflow-hidden grow shrink w-full max-w-[307px] px-4 py-9 rounded-[32px] border-[1.5px] border-solid hover:bg-[rgba(116,116,116,0.15)] transition-colors"
      variants={cardVariants}
    >
      <div className="w-full max-w-80 text-[#AAA] font-normal leading-[27px]">
        <blockquote className="text-[#AAA] opacity-80 max-md:text-sm max-md:leading-[22px]">
          {quote}
        </blockquote>
      </div>
      <div className="flex w-full max-w-80 gap-4 leading-[1.7] mt-10 max-md:mt-6">
        <img
          src={avatar}
          className="aspect-[1] object-contain w-[68px] shrink-0 rounded-full max-md:w-[50px]"
          alt={`${name} avatar`}
        />
        <div>
          <div className="text-white font-bold max-md:text-sm">
            {name}
          </div>
          <div className="text-[#AAA] font-normal mt-1 max-md:text-xs">
            {role}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const Testimonials: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const testimonials = [
    {
      quote: "Very nice product, was our favorite among several we tried. The developer/owner of Linkly is very responsive and developed helpful features quickly, following our request. Very cool.",
      name: "Robert W.",
      role: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "We were looking for a tool that allowed us to track link clicks from across many different sources to a 3rd party site we didn't have access to and pixel all of them centrally. Linkly is a clean, easy way of doing that quickly and cheaply.",
      name: "Jamie P.",
      role: "Digital Marketer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "Easily create shortened URLs which showcase your branding. Very easy to use - great customer help - clear data.",
      name: "Aleksandra R.",
      role: "Brand Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "Good features, relatively easy to use and got great results. Love the geo targeting feature whereby it auto detects user's location and redirects to appropriate local URL.",
      name: "Niall H.",
      role: "Growth Hacker",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "Also happy with the mailto link shortening which isn't offered by most link shorteners. This software is remarkably easy to use and would be a great choice for any marketer.",
      name: "Sagar J.",
      role: "Email Marketer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "This software is remarkably easy to use and would be a great choice for any marketer who wants to be able to track link metrics without losing brand integrity.",
      name: "Shanda E.",
      role: "Content Strategist",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <motion.section 
      className="w-full max-w-[1200px] mt-[134px] pb-[39px] px-4 max-md:mt-10 max-md:px-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="flex flex-col items-stretch">
        <motion.header
          className="flex w-full max-w-[911px] mx-auto flex-col items-center text-center"
          variants={headerVariants}
        >
          <h2 className="text-white text-5xl font-bold leading-[1.2] tracking-[-1.5px] max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px]">
            What people say about Linkly
          </h2>
          <p className="text-[#AAA] text-lg font-normal leading-[31px] opacity-80 w-full max-w-[633px] mt-6 max-md:text-base max-md:leading-[24px]">
            You're in good company. Thousands of businesses use Linkly to create tracking links, retarget visitors, make QR codes and more.
          </p>
        </motion.header>
        <div className="w-full text-base mt-20 max-md:mt-10">
          <motion.div 
            className="flex w-full items-center gap-6 flex-wrap justify-center max-md:flex-col max-md:gap-4"
            variants={containerVariants}
          >
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.avatar}
              />
            ))}
          </motion.div>
          <motion.div 
            className="flex w-full items-center gap-6 flex-wrap justify-center mt-6 max-md:flex-col max-md:gap-4 max-md:mt-4"
            variants={containerVariants}
          >
            {testimonials.slice(3, 6).map((testimonial, index) => (
              <TestimonialCard
                key={index + 3}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.avatar}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
