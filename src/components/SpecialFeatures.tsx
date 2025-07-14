import React from 'react';
import { BarChart3, Globe, Target, QrCode, Smartphone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
interface SpecialFeatureCardProps {
  title: string;
  description: string;
  iconComponent?: React.ReactNode;
}
const SpecialFeatureCard: React.FC<SpecialFeatureCardProps> = ({
  title,
  description,
  iconComponent
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
  return <motion.article className="justify-center items-center border-[color:var(--stroke-15-card,rgba(255,255,255,0.40))] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] backdrop-blur-[50px] flex min-w-60 flex-col overflow-hidden grow shrink w-full max-w-[307px] px-4 py-9 rounded-[32px] border-[1.5px] border-solid hover:bg-[rgba(116,116,116,0.15)] transition-colors" variants={cardVariants}>
      <div className="flex w-full max-w-80 flex-col items-stretch">
        <div className="justify-center items-center border-[color:var(--stroke-15-card,rgba(255,255,255,0.40))] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] backdrop-blur-[50px] bg-[rgba(116,116,116,0.07)] self-center flex min-h-[70px] w-[70px] flex-col overflow-hidden h-[70px] px-[11px] rounded-[32px] border-[1.5px] border-solid">
          {iconComponent || <div className="flex min-h-12 w-full" />}
        </div>
        <h3 className="text-white text-center text-2xl font-medium leading-[1.4] tracking-[-0.5px] mt-3 max-md:text-xl">
          {title}
        </h3>
        <p className="text-[#AAA] text-center text-base font-normal leading-[27px] opacity-80 mt-3 max-md:text-sm max-md:leading-[22px]">
          {description}
        </p>
      </div>
    </motion.article>;
};
export const SpecialFeatures: React.FC = () => {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const features = [{
    title: "Smart Link Analytics",
    description: "Get detailed insights into your link performance with real-time analytics, geographic data, and device breakdowns.",
    icon: <BarChart3 className="w-10 h-10" style={{
      stroke: 'url(#icon-gradient)'
    }} />
  }, {
    title: "Global Redirects",
    description: "Automatically redirect users to different destinations based on their location, device, or other criteria.",
    icon: <Globe style={{
      stroke: 'url(#icon-gradient)'
    }} className="w-10 h-10" />
  }, {
    title: "Branded Short Links",
    description: "Create professional short links with your own custom domain to maintain brand consistency.",
    icon: <Target className="w-10 h-10" style={{
      stroke: 'url(#icon-gradient)'
    }} />
  }];

  return <motion.section className="flex w-full max-w-[1200px] flex-col items-stretch mt-[134px] px-4 max-md:mt-10 max-md:px-2" initial="hidden" whileInView="visible" viewport={{
    once: true,
    margin: "-100px"
  }} variants={containerVariants}>
      {/* SVG Gradient Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF5552" />
            <stop offset="100%" stopColor="#F62623" />
          </linearGradient>
        </defs>
      </svg>
      
      <motion.header className="flex w-full max-w-[911px] mx-auto flex-col items-center text-center" variants={headerVariants}>
        <h2 className="text-white text-5xl font-bold leading-[60px] tracking-[-1.5px] max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px]">
          Powerful Features for
          <br />
          Link Management
        </h2>
        <p className="text-[#AAA] text-lg font-normal leading-[31px] opacity-80 w-full max-w-[633px] mt-6 max-md:text-base max-md:leading-[24px]">
          Everything you need to create, track, and optimize your links for maximum performance and insights.
        </p>
      </motion.header>
      <motion.div className="flex w-full items-center gap-6 flex-wrap justify-center mt-20 max-md:mt-10 max-md:flex-col max-md:gap-4" variants={containerVariants}>
        {features.map((feature, index) => <SpecialFeatureCard key={index} title={feature.title} description={feature.description} iconComponent={feature.icon} />)}
      </motion.div>
    </motion.section>;
};
