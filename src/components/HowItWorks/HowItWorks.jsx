import React from 'react';
import { Search, Users, MessageCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Find',
      description: 'Search for study partners by subject, experience, and location',
      iconColor: 'text-white',
      iconBg: 'bg-primary',
    },
    {
      icon: Users,
      title: 'Connect',
      description: 'Send partner requests and start building your study network',
      iconColor: 'text-white',
      iconBg: 'bg-primary',
    },
    {
      icon: MessageCircle,
      title: 'Study Together',
      description: 'Collaborate, share knowledge, and achieve your academic goals',
      iconColor: 'text-white',
      iconBg: 'bg-primary',
    },
  ];

  return (
    <section className="bg-base-200/30 py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
           <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4 tracking-wider uppercase">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-base-content mb-4">
            How It Works
          </h2>
          <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
            Your journey to finding the perfect study partner is just three steps away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-6xl mx-auto">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -z-10 rounded-full"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group text-center"
              >
                {/* Icon Circle */}
                <div
                  className={`w-24 h-24 bg-base-100 rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl z-10 relative border-4 border-base-200 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110`}
                >
                  <div className={`w-16 h-16 ${step.iconBg} rounded-full flex items-center justify-center shadow-inner`}>
                    <Icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold border-4 border-base-100 shadow-md">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-base-100 p-8 rounded-3xl shadow-lg border border-base-200/50 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    <h3 className="text-2xl font-bold text-base-content mb-3 font-display">
                      {step.title}
                    </h3>
                    <p className="text-base-content/60 leading-relaxed font-medium">
                      {step.description}
                    </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

