import React from "react";
import { Users, Target, Shield, Award, BookOpen, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
    
  // --- Inline Components for About Sections ---
  const TeamMember = ({ name, role, img }) => (
    <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 hover:shadow-lg transition-all text-center group">
       <div className="w-24 h-24 mx-auto bg-base-200 rounded-full mb-4 overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
          <img src={img} alt={name} className="w-full h-full object-cover" />
       </div>
       <h3 className="text-xl font-bold text-base-content mb-1">{name}</h3>
       <p className="text-primary text-sm font-medium">{role}</p>
    </div>
  );

  const StatCard = ({ icon, label, value }) => (
     <div className="p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200 text-center animate-fade-in hover:border-primary/50 transition-colors">
        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
           {icon}
        </div>
        <h3 className="text-3xl font-bold text-base-content mb-1">{value}</h3>
        <p className="text-base-content/60 font-medium">{label}</p>
     </div>
  );

  return (
    <div className="min-h-screen bg-base-200/30">
        
      {/* 1. Hero Section */}
      <section className="relative py-24 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />
         <div className="container mx-auto px-4 lg:px-8 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 animate-fade-in">Our Story</span>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-base-content mb-6 leading-tight">
               Revolutionizing <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Collaborative Learning</span>
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
               StudyMate was born from a simple idea: that students learn better when they learn together. We're on a mission to connect minds and empower success.
            </p>
         </div>
      </section>

      {/* 2. Mission & Values */}
      <section className="py-20 bg-base-100">
         <div className="container mx-auto px-4 lg:px-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                   <h2 className="text-3xl font-bold font-display text-base-content">
                      More Than Just a Study Platform
                   </h2>
                   <p className="text-base-content/70 text-lg leading-relaxed">
                      We believe that education should be accessible, engaging, and collaborative. In a world where isolation is common, we bridge the gap between students, fostering a community where knowledge is shared freely.
                   </p>
                   
                   <div className="space-y-6">
                      {[
                        { title: "Inclusivity", desc: "A welcoming space for students from all backgrounds.", icon: <Globe size={20} /> },
                        { title: "Excellence", desc: "Striving for high-quality connections and resources.", icon: <Award size={20} /> },
                        { title: "Trust", desc: "Verified profiles and safe interactions.", icon: <Shield size={20} /> },
                      ].map((item, i) => (
                         <div key={i} className="flex gap-4">
                             <div className="mt-1 flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                {item.icon}
                             </div>
                             <div>
                                <h4 className="text-lg font-bold text-base-content">{item.title}</h4>
                                <p className="text-base-content/60">{item.desc}</p>
                             </div>
                         </div>
                      ))}
                   </div>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-[3rem] transform rotate-3 opacity-20" />
                   <img 
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                      alt="Mission" 
                      className="relative rounded-[3rem] shadow-2xl w-full object-cover aspect-square transform -rotate-3 hover:rotate-0 transition-transform duration-500" 
                   />
                </div>
             </div>
         </div>
      </section>

      {/* 3. Impact Stats */}
      <section className="py-20">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <StatCard icon={<Users size={24}/>} value="50k+" label="Active Students" />
               <StatCard icon={<BookOpen size={24}/>} value="120k+" label="Study Sessions" />
               <StatCard icon={<Target size={24}/>} value="95%" label="Goal Completion" />
               <StatCard icon={<Globe size={24}/>} value="100+" label="Countries" />
            </div>
         </div>
      </section>

      {/* 4. Team Section (Mock) */}
      <section className="py-20 bg-base-100">
         <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-bold font-display text-base-content mb-12">Meet the Minds Behind</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               <TeamMember name="Alex Johnson" role="Founder & CEO" img="https://i.pravatar.cc/150?u=alex" />
               <TeamMember name="Sarah Williams" role="Head of Product" img="https://i.pravatar.cc/150?u=sarah" />
               <TeamMember name="Michael Chen" role="Tech Lead" img="https://i.pravatar.cc/150?u=mike" />
               <TeamMember name="Emily Davis" role="Community Lead" img="https://i.pravatar.cc/150?u=emily" />
            </div>
         </div>
      </section>

      {/* 5. CTA */}
      <section className="py-24 bg-base-200/50">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold font-display text-base-content mb-6">Ready to Join the Movement?</h2>
           <p className="text-lg text-base-content/70 max-w-2xl mx-auto mb-10">
             Start your journey with StudyMate today and find the perfect partner to help you succeed.
           </p>
           <div className="flex gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all transform hover:-translate-y-1">
                 Get Started Free
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-base-100 text-base-content font-bold rounded-full border border-base-300 hover:border-primary hover:text-primary transition-all">
                 Contact Us
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;
