
import React from 'react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

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
      className="w-full max-w-[900px] mt-[88px] px-4 max-md:mt-10 max-md:px-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="w-full">
        <div className="flex w-full flex-col items-center justify-center">
          <motion.div
            className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6"
            variants={itemVariants}
          >
            Track 1000 monthly clicks with all features included
          </motion.div>

          <motion.h1
            className="text-white text-center text-[68px] font-bold leading-[78px] tracking-[-2.5px] max-md:text-[42px] max-md:leading-[50px] max-md:tracking-[-1px] max-sm:text-[36px] max-sm:leading-[44px]"
            variants={itemVariants}
          >
            Tracking Links Solved
          </motion.h1>

          <motion.p
            className="text-[#AAA] text-center text-xl font-normal leading-[32px] opacity-90 w-full max-w-[700px] mt-6 max-md:text-lg max-md:leading-[28px] max-md:px-4"
            variants={itemVariants}
          >
            Create simple, beautiful and branded link trackers with smart redirects, retargeting pixels, QR codes and more.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-8 items-center"
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
                Go to Dashboard
              </button>
            </SignedIn>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="flex w-full max-w-[1000px] mt-16 rounded-2xl max-md:mt-12 overflow-hidden shadow-2xl"
        variants={itemVariants}
      >
        <div className="w-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-8 rounded-2xl border border-gray-700">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <span className="text-blue-400 font-mono">linkly.com/abc123</span>
                <span className="text-green-400">1,247 clicks</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <span className="text-blue-400 font-mono">linkly.com/xyz789</span>
                <span className="text-green-400">892 clicks</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <span className="text-blue-400 font-mono">linkly.com/def456</span>
                <span className="text-green-400">2,156 clicks</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};
