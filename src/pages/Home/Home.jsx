import React from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "../../components/HeroCarousel/HeroCarosel";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import TopStudents from "../../components/TopStudent/TopStudents";
import Testimonials from "../../components/Testimonials/Testimonials";
import { Users, BookOpen, Trophy, Globe, Target, Shield, Clock, Heart, HelpCircle, Mail } from "lucide-react";

// --- Section Components (Inline for Cleanliness given the task scope) ---

const StatsSection = () => (
  <section className="py-12 bg-base-100">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { label: "Active Students", value: "25k+", icon: <Users className="w-6 h-6" /> },
          { label: "Study Sessions", value: "120k+", icon: <BookOpen className="w-6 h-6" /> },
          { label: "Success Rate", value: "94%", icon: <Trophy className="w-6 h-6" /> },
          { label: "Countries", value: "50+", icon: <Globe className="w-6 h-6" /> },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-base-200/50 hover:bg-base-200 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex justify-center mb-3 text-primary">{stat.icon}</div>
            <h3 className="text-3xl font-bold font-display text-base-content mb-1">{stat.value}</h3>
            <p className="text-base-content/60 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="py-16 md:py-24 overflow-hidden">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl opacity-20 transform rotate-3 scale-105"></div>
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" 
            alt="Students studying" 
            className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3] transform transition-transform hover:scale-[1.01]"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-2">Our Mission</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-base-content leading-tight">
            Empowering Students to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Achieve More</span>
          </h2>
          <p className="text-lg text-base-content/70 leading-relaxed">
            StudyMate is more than just a platform; it's a movement to democratize collaborative learning. We believe that when students connect, share knowledge, and support each other, the potential for success is limitless.
          </p>
          <ul className="space-y-4">
            {[
              "Find partners based on your specific curriculum.",
              "Schedule sessions that fit your timeline.",
              "Track progress and celebrate milestones together."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                  <Target size={14} />
                </div>
                <span className="text-base-content/80 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-20 bg-base-200/50">
    <div className="container mx-auto px-4 lg:px-8">
       <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Why Choose StudyMate?</h2>
          <p className="text-base-content/60">Everything you need to find the perfect study partner and excel in your academic journey.</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Verified Profiles", desc: "Every student is verified to ensure a safe learning environment.", icon: <Shield size={32} /> },
            { title: "Smart Matching", desc: "Our AI matches you with partners who complement your learning style.", icon: <Target size={32} /> },
            { title: "Real-time Scheduling", desc: "Easily book sessions and manage your study calendar.", icon: <Clock size={32} /> },
          ].map((feature, idx) => (
             <div key={idx} className="bg-base-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-base-200">
               <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                 {feature.icon}
               </div>
               <h3 className="text-2xl font-bold mb-3 font-display">{feature.title}</h3>
               <p className="text-base-content/70 leading-relaxed">{feature.desc}</p>
             </div>
          ))}
       </div>
    </div>
  </section>
);

const CategoriesSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4 lg:px-8">
       <h2 className="text-3xl font-bold font-display mb-10 text-center">Popular Subjects</h2>
       <div className="flex flex-wrap justify-center gap-4">
         {["Mathematics", "Computer Science", "Physics", "Literature", "Chemistry", "Economics", "History", "Biology", "Engineering", "Law"].map((cat, i) => (
           <Link 
             to={`/findpartners?category=${cat}`} 
             key={i} 
             className="px-6 py-3 rounded-full bg-base-100 border border-base-300 hover:border-primary hover:text-primary transition-colors text-base-content font-medium shadow-sm"
           >
             {cat}
           </Link>
         ))}
       </div>
    </div>
  </section>
);

const FAQSection = () => (
  <section className="py-20 bg-base-200/50">
     <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
       <div className="text-center mb-16">
         <h2 className="text-3xl font-bold font-display mb-4">Frequently Asked Questions</h2>
         <p className="text-base-content/60">Got questions? We've got answers.</p>
       </div>
       <div className="space-y-4">
         {[
           { q: "Is StudyMate free to use?", a: "Yes! Basic features including finding partners and chatting are completely free." },
           { q: "How do I verify my student status?", a: "You can upload your student ID card or use your university email address." },
           { q: "Can I schedule offline study sessions?", a: "While we focus on online collaboration, you can coordinate offline meetups at your own discretion." },
         ].map((faq, i) => (
           <details key={i} className="group bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 open:border-primary/50 transition-all">
             <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg list-none">
               {faq.q}
               <span className="transition-transform group-open:rotate-180"><HelpCircle size={20} /></span>
             </summary>
             <p className="mt-4 text-base-content/70 leading-relaxed animate-fade-in">{faq.a}</p>
           </details>
         ))}
       </div>
     </div>
  </section>
);

const NewsletterSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="bg-gradient-to-br from-primary to-accent rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden">
         {/* Decorative circles */}
         <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
         
         <div className="relative z-10 max-w-2xl mx-auto space-y-8">
           <Mail size={48} className="mx-auto text-white/80" />
           <h2 className="text-3xl md:text-5xl font-bold font-display leading-tight">Join Our Weekly Newsletter</h2>
           <p className="text-lg text-white/80">Get the latest study tips, resource updates, and community highlights delivered straight to your inbox.</p>
           
           <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white"
             />
             <button type="submit" className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
               Subscribe
             </button>
           </form>
         </div>
      </div>
    </div>
  </section>
);

const BlogPreviewSection = () => (
    <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold font-display mb-10 text-center">Latest from the Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="overflow-hidden rounded-2xl mb-4 aspect-video">
                            <img src={`https://source.unsplash.com/random/800x600?study,${i}`} alt="Blog" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <p className="text-primary text-sm font-semibold mb-2">Study Tips</p>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">How to Master Time Management for Finals</h3>
                        <p className="text-base-content/60 line-clamp-2">Discover the proven techniques used by top students to balance their schedule and ace their exams without burning out.</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- Main Page Component ---

const Home = () => {
  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 pt-24 pb-8 lg:pt-32 lg:pb-12">
        <HeroCarousel />
      </section>

      {/* 2. Stats Section */}
      <StatsSection />
      
      {/* 3. About Section */}
      <AboutSection />
      
      {/* 4. Features Section */}
      <FeaturesSection />

      {/* 5. How It Works Section */}
      <HowItWorks />
      
      {/* 6. Top Partners/Students */}
      <TopStudents />
      
      {/* 7. Categories */}
      <CategoriesSection />

      {/* 8. Testimonials Section */}
      <Testimonials />
      
      {/* 9. Blog Preview */}
      {/* <BlogPreviewSection />  Uncomment if desired, mocked images might be flaky */}

      {/* 10. FAQ Section */}
      <FAQSection />

      {/* 11. Newsletter CTA */}
      <NewsletterSection />
    </div>
  );
};

export default Home;

