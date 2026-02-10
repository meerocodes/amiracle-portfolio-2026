
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';
import { Mail, Linkedin, Twitter } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const subject = `Portfolio Inquiry: ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    window.location.href = `mailto:hello@amiracle.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id={SectionId.CONTACT} className="py-24 bg-transparent relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-7xl font-display font-bold mb-6 text-slate-900 dark:text-white">Let's Create Together</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Ready to start your next project? I'm currently open for freelance work and collaborations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 dark:bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-xl dark:shadow-none"
        >
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-[16px] text-slate-900 dark:text-white focus:border-neon-indigo dark:focus:border-neon-purple focus:outline-none transition-colors" 
                            placeholder="John Doe" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-[16px] text-slate-900 dark:text-white focus:border-neon-indigo dark:focus:border-neon-purple focus:outline-none transition-colors" 
                            placeholder="john@example.com" 
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Message</label>
                    <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4} 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-[16px] text-slate-900 dark:text-white focus:border-neon-indigo dark:focus:border-neon-purple focus:outline-none transition-colors" 
                        placeholder="Tell me about your project..."
                        required
                    ></textarea>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-neon-indigo to-neon-purple dark:from-neon-purple dark:to-neon-cyan text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity">
                    Send Message
                </button>
            </form>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-8 mt-12"
        >
            <a href="mailto:hello@amiracle.dev" className="text-slate-500 hover:text-neon-indigo dark:hover:text-neon-cyan transition-colors transform hover:-translate-y-1 duration-300">
                <Mail size={32} />
            </a>
            {/* Hidden Social Links
            <a href="#" className="text-slate-500 hover:text-neon-indigo dark:hover:text-neon-cyan transition-colors transform hover:-translate-y-1 duration-300">
                <Linkedin size={32} />
            </a>
            <a href="#" className="text-slate-500 hover:text-neon-indigo dark:hover:text-neon-cyan transition-colors transform hover:-translate-y-1 duration-300">
                <Twitter size={32} />
            </a>
            */}
        </motion.div>

        <div className="mt-16 text-slate-500 dark:text-slate-600 text-sm">
            © {new Date().getFullYear()} Amiracle. All rights reserved.
        </div>
      </div>
    </section>
  );
};

export default Contact;
