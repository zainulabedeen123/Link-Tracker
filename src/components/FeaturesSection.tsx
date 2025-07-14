
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Smartphone, Target, QrCode, Shield } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className = ""
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
      className={`bg-gray-900/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/50 transition-colors ${className}`}
      variants={cardVariants}
    >
      <div className="flex flex-col items-start">
        <div className="bg-blue-600/20 p-3 rounded-lg mb-6">
          {icon}
        </div>
        <h3 className="text-white text-xl font-semibold mb-4">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
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
      id="features"
      className="w-full max-w-[1200px] mt-32 px-4 max-md:mt-20 max-md:px-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="flex flex-col items-stretch max-md:max-w-full">
        <motion.header
          className="self-center flex w-[911px] max-w-full flex-col items-center text-center mb-16"
          variants={headerVariants}
        >
          <h2 className="text-white text-5xl font-bold leading-[60px] tracking-[-1.5px] max-md:max-w-full max-md:text-[36px] max-md:leading-[44px] max-md:tracking-[-1px]">
            How Linkly Works
          </h2>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-md:gap-6"
          variants={containerVariants}
        >
          <FeatureCard
            title="Redirect by Country or Device"
            description="Redirect users to URLs based on their country or device, or use a link rotator. Change the destination even after the link is created."
            icon={<Globe className="w-6 h-6 text-blue-400" />}
          />
          <FeatureCard
            title="Branded Link Shortening"
            description="Use your own domain to create short tracking links with your branding."
            icon={<Target className="w-6 h-6 text-blue-400" />}
          />
          <FeatureCard
            title="Beautiful Click Tracking Reports"
            description="Track the number of clicks on a particular link. Breakdowns by country, device, ISP, destination and more."
            icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
          />
          <FeatureCard
            title="QR Code Generation"
            description="Make QR codes with dynamic destinations that can be updated anytime."
            icon={<QrCode className="w-6 h-6 text-blue-400" />}
          />
          <FeatureCard
            title="Mobile App Redirects"
            description="Send iOS users to the Apple App Store and Android users to the Google Play Store automatically."
            icon={<Smartphone className="w-6 h-6 text-blue-400" />}
          />
          <FeatureCard
            title="Secure & GDPR Compliant"
            description="All links are secure with HTTPS and fully GDPR compliant for privacy protection."
            icon={<Shield className="w-6 h-6 text-blue-400" />}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};
