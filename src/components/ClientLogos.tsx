
import React from 'react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const ClientLogos: React.FC = () => {
  const navigate = useNavigate();

  // Using placeholder company names that would typically use link tracking
  const companies = [
    { name: "Microsoft", color: "text-blue-400" },
    { name: "Shopify", color: "text-green-400" },
    { name: "Slack", color: "text-purple-400" },
    { name: "Airbnb", color: "text-red-400" },
    { name: "Spotify", color: "text-green-500" },
    { name: "Netflix", color: "text-red-500" },
    { name: "Uber", color: "text-gray-300" },
    { name: "Dropbox", color: "text-blue-500" },
  ];

  // Duplicate companies array for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
      className="w-full flex min-h-[265px] flex-col overflow-hidden items-stretch justify-center mt-20 py-16 max-md:mt-10 max-md:py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="flex w-full flex-col items-stretch px-8 max-md:px-4">
        <motion.h2
          className="text-white text-center text-2xl font-semibold mb-4 max-md:text-xl"
          variants={itemVariants}
        >
          250,000+ Organizations, Big and Small, Trust Linkly
        </motion.h2>
        <motion.div
          className="overflow-hidden mt-8 max-md:mt-6"
          variants={itemVariants}
        >
          <div className="flex gap-12 animate-marquee items-center justify-center">
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className={`text-2xl font-bold ${company.color} opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap max-md:text-xl`}
              >
                {company.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-12 items-center justify-center"
          variants={itemVariants}
        >
          <div className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
            Track 1000 monthly clicks with all features included
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-6 items-center justify-center"
          variants={itemVariants}
        >
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors min-w-[200px]">
                Get Started for Free
              </button>
            </SignInButton>
            <p className="text-gray-400 text-sm">No credit card required</p>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors min-w-[200px]"
            >
              Create Your First Link
            </button>
          </SignedIn>
        </motion.div>
      </div>
    </motion.section>
  );
};
