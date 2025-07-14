
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
      quote: "AI Finance has transformed the way I manage my finances. The personalized insights and automated features have saved me so much time and effort.",
      name: "Sarah White",
      role: "Software Engineer",
      avatar: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/e6bea8c89909d9da1dec8e771f74bcc976273dbb?placeholderIfAbsent=true"
    },
    {
      quote: "Thanks to AI Finance, I feel more confident in my investment decisions. The real-time analysis and predictive analytics are game-changers.",
      name: "Sarah White",
      role: "Software Engineer",
      avatar: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/e3aaae633e2b535f255052bf39a89302bf6e58c1?placeholderIfAbsent=true"
    },
    {
      quote: "AI Finance has completely transformed my financial management. The personalized insights and automated features save me so much time.",
      name: "Sarah White",
      role: "Software Engineer",
      avatar: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/aa2b1aa0f5d8bc9e9aada43cbd1e648ee01ab047?placeholderIfAbsent=true"
    },
    {
      quote: "Thanks to AI Finance, I feel more confident in my investment decisions. The real-time analysis and predictive analytics are game-changers.",
      name: "Sarah White",
      role: "Software Engineer",
      avatar: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/5e23029fb9a7dda3c2411547ec09fff93eedf2ca?placeholderIfAbsent=true"
    },
    {
      quote: "The fraud detection feature gives me peace of mind, knowing my financial in my investment decisions data is secure and protected.",
      name: "Sarah White",
      role: "Software Engineer",
      avatar: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/82f5d04423f994a92ae42c2ca2201f7655634006?placeholderIfAbsent=true"
    },
    {
      quote: "AI Finance's budgeting tools have helped me stay on track with my financial goals. The AI adapts to my changing financial situation effortlessly.",
      name: "Sarah White",
      role: "Software Engineer",
      avatar: "https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/b374f42ab25e2b15401f35e18dd64e7d003e91eb?placeholderIfAbsent=true"
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
          <h2 className="text-white text-6xl font-medium leading-[1.2] tracking-[-1.5px] max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px]">
            Real Experiences from Our Users
          </h2>
          <p className="text-[#AAA] text-lg font-normal leading-[31px] opacity-80 w-full max-w-[633px] mt-6 max-md:text-base max-md:leading-[24px]">
            Discover the power of AI-driven financial solutions for smarter,
            faster, and more secure financial decision-making
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
