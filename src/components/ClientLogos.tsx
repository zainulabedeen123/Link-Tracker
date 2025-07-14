
import React from 'react';
import { motion } from 'framer-motion';

export const ClientLogos: React.FC = () => {
  const logos = [
    { src: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/98fb1f594860e9bb69dde512d5ef81a224b638c8?placeholderIfAbsent=true", alt: "Client 1" },
    { src: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/aed41a114ad6ace902babf16fff1e571efc747c2?placeholderIfAbsent=true", alt: "Client 2" },
    { src: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/8b308c32e3f562cc3e6cc13911dacd53e581a01b?placeholderIfAbsent=true", alt: "Client 3" },
    { src: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/37cb224c8a8cc5878bce78c89ee8fcaf1911080f?placeholderIfAbsent=true", alt: "Client 4" },
    { src: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/6cb1d91505e360bca4d842f7bacdaa2a19495957?placeholderIfAbsent=true", alt: "Client 5" },
    { src: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/c2e390e62b33da853d8bd4490f776a1ff15ef248?placeholderIfAbsent=true", alt: "Client 6" },
  ];

  // Duplicate logos array for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

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
      className="w-full flex min-h-[265px] flex-col overflow-hidden items-stretch justify-center mt-[134px] py-[69px] max-md:mt-10 max-md:py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="flex w-full flex-col items-stretch px-8 max-md:px-4">
        <motion.p 
          className="text-[#AAA] text-center text-lg font-normal leading-[31px] max-md:text-base"
          variants={itemVariants}
        >
          Trusted by thousands from worldwide
        </motion.p>
        <motion.div 
          className="overflow-hidden mt-8 max-md:mt-6"
          variants={itemVariants}
        >
          <div className="flex gap-6 animate-marquee">
            {duplicatedLogos.map((logo, index) => (
              <img
                key={index}
                src={logo.src}
                className="aspect-[2.61] object-contain w-[167px] shrink-0 opacity-60 hover:opacity-100 transition-opacity max-md:w-[120px] max-sm:w-[100px]"
                alt={logo.alt}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
