import React from 'react';
import { Check } from 'lucide-react';
interface PricingPlanProps {
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}
const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  subtitle,
  price,
  features,
  isPopular = false
}) => {
  return <div className="flex-1 p-4 pt-9 pb-9 bg-[rgba(115.81,115.81,115.81,0.07)] shadow-[2px_4px_16px_rgba(248,248,248,0.06)_inset] overflow-hidden rounded-[32px] border-[1.5px] border-[rgba(255,255,255,0.15)] backdrop-blur-[50px] flex flex-col justify-center items-center gap-6">
      <div className="w-[276px] pr-12 flex flex-col justify-start items-start gap-10">
        <div className={`${isPopular ? 'relative' : ''} flex flex-col justify-start items-start gap-5`}>
          <div className="flex flex-col justify-start items-start">
            <div className="text-white text-2xl font-semibold leading-8">{title}</div>
            <div className="opacity-60 text-[#AAA] text-base font-normal leading-[27.2px]">{subtitle}</div>
          </div>
          {isPopular && <div className="absolute left-[121px] top-[3px] px-3 py-1 bg-white rounded-full flex justify-center items-center gap-2">
              <div className="text-[#FF5552] text-sm font-bold leading-6">POPULAR</div>
            </div>}
          <div className="w-[276px] h-0.5 bg-[#353945]"></div>
          <div className="flex flex-col justify-start items-start">
            <div className="flex justify-start items-start gap-1">
              <div className="text-[#FCFCFD] text-2xl font-normal leading-8">$</div>
              <div className="text-[#FCFCFD] text-[40px] font-bold leading-12">{price} USD</div>
            </div>
            <div className="text-[#AAA] text-base font-normal leading-[27.2px]">per person, per month</div>
          </div>
        </div>
        <div className="w-[278px] flex flex-col justify-start items-start gap-4">
          {features.map((feature, index) => <div key={index} className="flex justify-start items-center gap-2">
              <div className="w-6 h-6 relative overflow-hidden">
                <Check strokeWidth={3} className="w-4 h-4 absolute left-1.5 top-1.5 text-[#FF5552]" />
              </div>
              <div className="w-[244px] text-[#AAA] text-base font-normal leading-[27.2px]">{feature}</div>
            </div>)}
        </div>
        <button className="w-[155px] h-[63px] px-7 py-3 bg-gradient-to-r from-[#FF5552] to-[#F62623] shadow-[0px_32px_24px_-16px_rgba(0,0,0,0.40)] rounded-full border-[1.5px] border-[#FF5552] backdrop-blur-[6px] flex justify-center items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="text-center text-[#FCFCFD] text-lg font-normal leading-[30.6px]">Get Started</div>
        </button>
      </div>
    </div>;
};
export const PricingSection: React.FC = () => {
  const plans = [{
    title: "Basic",
    subtitle: "For individuals",
    price: "29",
    features: ["Comprehensive Dashboard", "Basic Budgeting Tools", "Monthly Financial Reports", "3 Financial Accounts", "Email Support"]
  }, {
    title: "Premium",
    subtitle: "For growing businesses",
    price: "59",
    features: ["Everything in Basic", "Advanced Analytics", "Real-time Market Data", "Investment Tracking", "Priority Support"],
    isPopular: true
  }, {
    title: "Enterprise",
    subtitle: "For large organizations",
    price: "99",
    features: ["Everything in Premium", "Custom Integrations", "Dedicated Account Manager", "Advanced Security", "24/7 Phone Support"]
  }];
  return <section className="w-full max-w-[1200px] mt-[134px] px-4 max-md:mt-10 max-md:px-2">
      <div className="flex flex-col justify-start items-start gap-20">
        <div className="self-stretch flex flex-col justify-start items-center gap-6">
          <div className="self-stretch text-center text-white text-6xl font-medium leading-[72px] tracking-[-1.5px] max-md:text-[32px] max-md:leading-[40px] max-md:tracking-[-1px]">
            Tailored Solutions for<br />Every Need
          </div>
          <div className="w-full max-w-[633px] opacity-80 text-center text-[#AAA] text-lg font-normal leading-[30.6px] max-md:text-base max-md:leading-[24px]">
            Discover the power of AI-driven financial solutions for smarter, faster, and more secure financial decision-making
          </div>
        </div>
        <div className="self-stretch flex justify-start items-center gap-6 max-md:flex-col max-md:gap-4">
          {plans.map((plan, index) => <PricingPlan key={index} title={plan.title} subtitle={plan.subtitle} price={plan.price} features={plan.features} isPopular={plan.isPopular} />)}
        </div>
      </div>
    </section>;
};