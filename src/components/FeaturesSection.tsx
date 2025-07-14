
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
  imageUrl?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  className = "",
  imageUrl
}) => {
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
      className={`items-center border-[color:var(--stroke-15-card,rgba(255,255,255,0.40))] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] backdrop-blur-[50px] bg-[rgba(116,116,116,0.07)] self-stretch flex h-[580px] flex-col overflow-hidden my-auto rounded-[32px] border-[1.5px] border-solid max-md:h-[500px] ${className}`}
      variants={cardVariants}
    >
      {imageUrl && <div className="w-full h-48 overflow-hidden max-md:h-32">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover pt-[20px]" />
        </div>}
      <div className="flex max-w-full flex-col items-stretch justify-center px-14 py-8 flex-1 max-md:px-5 max-md:py-6">
        <div className="w-full max-md:max-w-full">
          <div className="flex w-full flex-col items-stretch max-md:max-w-full">
            <div className="w-full max-md:max-w-full">
              <h3 className="text-white text-2xl font-medium leading-[1.4] tracking-[-0.5px] max-md:max-w-full max-md:text-xl">
                {title}
              </h3>
              <div className="flex w-full items-center gap-2 text-lg text-[#f8f8f8] font-normal leading-[31px] mt-2 max-md:text-base">
                <p className="opacity-80 self-stretch my-auto max-md:max-w-full">
                  {description}
                </p>
              </div>
            </div>
            <button className="text-white mt-8 px-8 py-3 rounded-[32px] max-md:px-5 max-md:text-sm hover:opacity-90 transition-opacity" style={{
            background: 'linear-gradient(90deg, #FF5552 0%, #F62623 100%)',
            boxShadow: '2px 4px 16px rgba(248, 248, 248, 0.06) inset',
            outline: '1px rgba(255, 255, 255, 0.25) solid',
            outlineOffset: '-1px',
            backdropFilter: 'blur(50px)',
            fontWeight: '700',
            fontSize: '16px',
            lineHeight: '24px'
          }}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const FeaturesSection: React.FC = () => {
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

  return (
    <motion.section 
      className="w-full max-w-[1200px] mt-[134px] px-4 max-md:mt-10 max-md:px-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="flex flex-col items-stretch max-md:max-w-full">
        <motion.header 
          className="self-center flex w-[911px] max-w-full flex-col items-center text-center"
          variants={headerVariants}
        >
          <h2 className="text-white text-6xl font-medium leading-[72px] tracking-[-1.5px] max-md:max-w-full max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px]">
            Explore the Robust Features of
            <br />
            Our AI Finance Platform
          </h2>
          <p className="text-[#AAA] text-lg font-normal leading-[31px] opacity-80 w-[633px] max-w-full mt-6 max-md:text-base max-md:leading-[24px]">
            Discover the power of AI-driven financial solutions for smarter,
            faster, and more secure financial decision-making
          </p>
        </motion.header>
        <motion.div 
          className="w-full mt-20 max-md:mt-10"
          variants={containerVariants}
        >
          <div className="flex w-full items-stretch gap-6 flex-wrap max-md:flex-col max-md:gap-4">
            <FeatureCard title="Risk Management" description="Utilize AI-powered tools to assess and manage financial risks, offering strategies to mitigate potential losses and protect your investments." className="grow shrink w-full max-w-[648px] max-md:w-full" imageUrl="/lovable-uploads/039a2b9d-4617-4cff-9bc9-1136b78ebf4c.png" />
            <FeatureCard title="Real-Time Market Analysis" description="Access up-to-the-minute market data and analysis to make informed investment decisions." className="grow shrink w-full max-w-[352px] max-md:w-full" imageUrl="/lovable-uploads/14147cd7-55a3-4018-9c27-de2e43ec810a.png" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
