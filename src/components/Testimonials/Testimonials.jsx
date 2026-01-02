import React from 'react';
// Swiper component-gulo import korun
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';

// Swiper CSS import korun
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Star, Quote } from 'lucide-react';

// Dummy data for testimonials
const testimonialData = [
  {
    name: 'Sarah Johnson',
    role: 'Computer Science Student',
    quote: 'StudyMate helped me find a partner for my final year project. We aced it! The platform is intuitive and very effective.',
    image: 'https://i.ibb.co.com/nszfCGF6/image.png', 
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Mathematics Major',
    quote: 'I was struggling with advanced calculus. Finding a study buddy here made learning collaborative and fun. Highly recommended!',
    image: 'https://i.ibb.co.com/m5w8p5tN/image.png', 
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Physics Enthusiast',
    quote: 'The "Top Students" feature is amazing. I connected with an expert who helped me understand complex theories. A game-changer!',
    image: 'https://i.ibb.co.com/7xF3gzvH/image.png', // Placeholder image
    rating: 4,
  },
  {
    name: 'David Kim',
    role: 'Data Science Aspirant',
    quote: 'A great platform to find peers for group studies and assignments. The search filter is very accurate.',
    image: 'https://i.ibb.co.com/20W29pKw/image.png', // Placeholder image
    rating: 5,
  },
];

// Rating star component
const Rating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-base-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-4 tracking-wider uppercase">Student Success Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-base-content mb-6">
            Loved solely by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Students</span>
          </h2>
          <p className="text-xl text-base-content/60">
            Join thousands of students who have found their perfect study match and achieved their academic goals.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          spaceBetween={40}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-16 !px-4" // !px-4 to prevent shadow clipping
        >
          {testimonialData.map((item, index) => (
            <SwiperSlide key={index} className="h-full">
              <div className="bg-base-100 rounded-[2rem] p-8 shadow-xl border border-base-200 h-full flex flex-col relative group hover:-translate-y-2 transition-transform duration-300">
                {/* Quote Icon Background */}
                <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote size={64} className="text-primary fill-current" />
                </div>

                {/* Rating */}
                <div className="mb-6 relative z-10">
                   <div className="inline-flex gap-1 bg-orange-500/10 px-3 py-1.5 rounded-full">
                     {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < item.rating ? 'text-orange-500 fill-orange-500' : 'text-base-300'}`}
                        />
                      ))}
                   </div>
                </div>

                {/* Quote Text */}
                <p className="text-lg text-base-content/80 font-medium leading-relaxed italic mb-8 flex-grow relative z-10">
                  "{item.quote}"
                </p>
                
                {/* User Info */}
                <div className="flex items-center gap-4 mt-auto border-t border-base-200 pt-6">
                  <div className="relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                     <img src={item.image} alt={item.name} className="w-14 h-14 rounded-full object-cover relative z-10 border-2 border-base-100" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-base-content font-display">{item.name}</h4>
                    <p className="text-sm font-medium text-primary">{item.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;