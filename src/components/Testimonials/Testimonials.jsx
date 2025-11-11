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
    image: 'https://i.ibb.co/6yqfL81/profile1.jpg', // Placeholder image
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Mathematics Major',
    quote: 'I was struggling with advanced calculus. Finding a study buddy here made learning collaborative and fun. Highly recommended!',
    image: 'https://i.ibb.co/3kC2C31/profile2.jpg', // Placeholder image
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Physics Enthusiast',
    quote: 'The "Top Students" feature is amazing. I connected with an expert who helped me understand complex theories. A game-changer!',
    image: 'https://i.ibb.co/d6QZB04/profile3.jpg', // Placeholder image
    rating: 4,
  },
  {
    name: 'David Kim',
    role: 'Data Science Aspirant',
    quote: 'A great platform to find peers for group studies and assignments. The search filter is very accurate.',
    image: 'https://i.ibb.co/yY1kG0z/profile4.jpg', // Placeholder image
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
    <section className="bg-gray-50 dark:bg-gray-800/50 py-16 lg:py-20 transition-colors">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#300A91] dark:text-purple-400 mb-4">
            What Our Students Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from students who found success with StudyMate
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          spaceBetween={30} // Slide-gular moddhe gap
          slidesPerView={1} // Mobile-e 1-ta slide
          loop={true}
          autoplay={{
            delay: 5000, // 5 second por por change hobe
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          breakpoints={{
            // Tablet size
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            // Desktop size
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="pb-12" // Pagination-er jonno niche padding
        >
          {testimonialData.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 h-full flex flex-col justify-between border border-gray-200 dark:border-gray-700">
                <div>
                  <Quote className="w-10 h-10 text-[#300A91] dark:text-purple-400 mb-4" fill="#300A91" />
                  <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                    "{item.quote}"
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.role}</p>
                      </div>
                    </div>
                    {/* Rating */}
                    <Rating rating={item.rating} />
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