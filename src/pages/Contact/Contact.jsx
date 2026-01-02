import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock submission
    setTimeout(() => {
        setLoading(false);
        alert("Message sent! (Mock)");
        setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div className="min-h-screen bg-base-200/30">
        
      {/* 1. Hero Section */}
      <section className="py-20 bg-base-100 border-b border-base-200">
         <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-base-content mb-6">get in <span className="text-primary">Touch</span></h1>
            <p className="text-xl text-base-content/60 max-w-xl mx-auto">
               Have questions, feedback, or just want to say hello? We'd love to hear from you.
            </p>
         </div>
      </section>

      <section className="py-20">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                
                {/* Contact Info & Details */}
                <div className="lg:w-1/3 space-y-8">
                    <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"/>
                        
                        <h3 className="text-2xl font-bold mb-6 font-display">Contact Information</h3>
                        <p className="text-white/80 mb-8 leading-relaxed">Fill out the form and our team will get back to you within 24 hours.</p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md"><Phone size={20}/></div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Phone</p>
                                    <p className="font-medium">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md"><Mail size={20}/></div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Email</p>
                                    <p className="font-medium">support@studymate.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md"><MapPin size={20}/></div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Office</p>
                                    <p className="font-medium">123 Education Lane, NY</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* FAQ Mini */}
                    <div className="bg-base-100 p-8 rounded-3xl border border-base-200">
                        <h4 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                           <MessageSquare size={18} className="text-primary"/>
                           Quick Help
                        </h4>
                        <p className="text-base-content/70 italic text-sm">
                           "Check our FAQ section for instant answers to common questions about partner matching."
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:w-2/3">
                    <div className="bg-base-100 p-8 md:p-10 rounded-3xl shadow-sm border border-base-200">
                        <h3 className="text-2xl font-bold text-base-content mb-8 font-display">Send a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-base-content mb-2">Your Name</label>
                                    <input 
                                       type="text" name="name" required
                                       className="w-full px-4 py-3 rounded-xl bg-base-200/50 border border-base-300 focus:outline-none focus:border-primary text-base-content transition-colors"
                                       placeholder="John Doe"
                                       value={formData.name} onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-base-content mb-2">Email Address</label>
                                    <input 
                                       type="email" name="email" required
                                       className="w-full px-4 py-3 rounded-xl bg-base-200/50 border border-base-300 focus:outline-none focus:border-primary text-base-content transition-colors"
                                       placeholder="john@example.com"
                                       value={formData.email} onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-base-content mb-2">Subject</label>
                                <input 
                                   type="text" name="subject" required
                                   className="w-full px-4 py-3 rounded-xl bg-base-200/50 border border-base-300 focus:outline-none focus:border-primary text-base-content transition-colors"
                                   placeholder="How can we help?"
                                   value={formData.subject} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-base-content mb-2">Message</label>
                                <textarea 
                                   name="message" required rows="5"
                                   className="w-full px-4 py-3 rounded-xl bg-base-200/50 border border-base-300 focus:outline-none focus:border-primary text-base-content transition-colors resize-none"
                                   placeholder="Tell us more about your inquiry..."
                                   value={formData.message} onChange={handleChange}
                                ></textarea>
                            </div>
                            
                            <button 
                               type="submit" disabled={loading}
                               className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : (
                                    <>
                                       Send Message <Send size={18}/>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
         </div>
      </section>
    </div>
  );
};

export default Contact;
