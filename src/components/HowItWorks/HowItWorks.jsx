import React from 'react';
import { Search, Users, MessageCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Find',
      description: 'Search for study partners by subject, experience, and location',
      iconColor: 'text-white',
      iconBg: 'bg-[#300A91] dark:bg-purple-600',
    },
    {
      icon: Users,
      title: 'Connect',
      description: 'Send partner requests and start building your study network',
      iconColor: 'text-white',
      iconBg: 'bg-[#300A91] dark:bg-purple-600',
    },
    {
      icon: MessageCircle,
      title: 'Study Together',
      description: 'Collaborate, share knowledge, and achieve your academic goals',
      iconColor: 'text-white',
      iconBg: 'bg-[#300A91] dark:bg-purple-600',
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-800/50 py-16 lg:py-20 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start your journey in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                {/* Icon Circle */}
                <div
                  className={`w-16 h-16 ${step.iconBg} rounded-full flex items-center justify-center mb-6 mx-auto shadow-md`}
                >
                  <Icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>

             

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

