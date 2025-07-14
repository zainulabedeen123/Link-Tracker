
import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
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

  const itemVariants = {
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
    <motion.section 
      className="w-full max-w-[858px] mt-[88px] px-4 max-md:mt-10 max-md:px-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="w-full">
        <div className="flex w-full flex-col items-center justify-center">
          <motion.h1 
            className="text-white text-center text-[68px] font-medium leading-[78px] tracking-[-2.5px] max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px] max-sm:text-[28px] max-sm:leading-[36px]"
            variants={itemVariants}
          >
            AI Solutions for Personal and
            <br />
            Business Finance
          </motion.h1>
          <motion.p 
            className="text-[#AAA] text-center text-lg font-normal leading-[31px] opacity-80 w-full max-w-[697px] mt-6 max-md:text-base max-md:leading-[24px] max-md:px-4"
            variants={itemVariants}
          >
            Discover the power of AI-driven financial solutions for
            smarter, faster, and more secure financial decision-making
          </motion.p>
          <motion.div 
            className="w-full max-w-[182px] text-base font-bold leading-[1.7] mt-6 rounded-[100px]"
            variants={itemVariants}
          >
            <button className="text-white w-full border-[color:var(--Linear,#FF5552)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px] min-h-[58px] gap-3 overflow-hidden px-7 py-4 rounded-[100px] border-[1.5px] border-solid max-md:px-5 max-md:min-h-[50px] hover:bg-[rgba(33,33,43,0.80)] transition-colors">
              Get Started
            </button>
          </motion.div>
        </div>
      </div>
      <motion.div 
        className="flex w-full max-w-[1085px] mt-[88px] rounded-[55px] max-md:mt-10 max-md:rounded-[30px] overflow-hidden"
        variants={itemVariants}
      >
        <img src="/lovable-uploads/bd1353e9-95fa-453a-9adb-4a89e832f7f0.png" alt="AI Finance Dashboard Interface" className="w-full h-auto min-h-[561px] max-md:min-h-[300px] object-cover" />
      </motion.div>
    </motion.section>
  );
};
