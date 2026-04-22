import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Users, Zap, Code2, ChevronRight, Activity, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/Logo';

export function About() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div className="min-h-screen bg-surface font-sans text-ink flex flex-col relative overflow-hidden">
      
      {/* Premium Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[20%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px]"
        />
      </div>

      <header className="px-6 sm:px-10 py-6 flex justify-between items-center bg-surface/50 backdrop-blur-xl sticky top-0 z-50 border-b border-line/30">
        <Link to="/login" className="group flex items-center justify-center w-12 h-12 rounded-full bg-card border border-line hover:border-primary/50 transition-all shadow-sm">
          <ArrowLeft className="w-5 h-5 text-ink group-hover:text-primary transition-colors" />
        </Link>
        <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" textClass="font-extrabold text-xl" />
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 lg:py-32 relative z-10 w-full">
        
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Version 2.0 is Live
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-ink">
            Crafted for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#a855f7] to-accent">
              Elite Developers
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted leading-relaxed font-light max-w-2xl mx-auto">
            Skill Tracker is a meticulously engineered operating system designed to transform your daily chaos into measurable, unstoppable momentum.
          </p>

          <div className="flex items-center justify-center gap-4 mt-10">
            <Link to="/register" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center gap-2 hover:-translate-y-1">
              Start Tracking Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-32">
          {[
            { label: 'Uptime', val: '99.9%', icon: Activity },
            { label: 'Codebase', val: 'TypeScript', icon: Code2 },
            { label: 'Security', val: 'Enterprise', icon: ShieldCheck },
            { label: 'Users', val: '10k+', icon: Users },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-card/40 backdrop-blur-md rounded-3xl border border-line/50 hover:border-primary/30 transition-colors"
            >
              <stat.icon className="w-8 h-8 text-primary mb-3 opacity-80" />
              <div className="text-3xl font-black text-ink mb-1">{stat.val}</div>
              <div className="text-sm font-semibold text-muted uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-32">
          <motion.div 
            style={{ y: y1 }}
            className="p-8 md:p-10 bg-gradient-to-b from-card to-card/50 border border-line rounded-[2rem] shadow-xl shadow-black/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-125 duration-500"></div>
            <div className="w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center mb-8 text-white">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-ink">Laser Focus</h3>
            <p className="text-muted leading-relaxed">
              We cut out the noise. Our platform provides a distraction-free environment to log exactly what matters: your reps, your time, your mastery.
            </p>
          </motion.div>

          <motion.div 
            className="p-8 md:p-10 bg-gradient-to-b from-card to-card/50 border border-line rounded-[2rem] shadow-xl shadow-black/5 relative overflow-hidden group mt-0 md:mt-12"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-125 duration-500"></div>
            <div className="w-16 h-16 rounded-2xl bg-accent shadow-lg shadow-accent/30 flex items-center justify-center mb-8 text-white">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-ink">Velocity Tracking</h3>
            <p className="text-muted leading-relaxed">
              Instantly map your progress over time. We turn unstructured data into beautifully rendered, actionable heatmaps and charts.
            </p>
          </motion.div>

          <motion.div 
            style={{ y: y2 }}
            className="p-8 md:p-10 bg-gradient-to-b from-card to-card/50 border border-line rounded-[2rem] shadow-xl shadow-black/5 relative overflow-hidden group mt-0 md:-mt-12"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-125 duration-500"></div>
            <div className="w-16 h-16 rounded-2xl bg-success shadow-lg shadow-success/30 flex items-center justify-center mb-8 text-white">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-ink">Built for Gen-Z</h3>
            <p className="text-muted leading-relaxed">
              Designed from the ground up to feel fast, fluid, and native. A next-gen tool for next-gen creators trying to escape the tutorial hell.
            </p>
          </motion.div>
        </div>

        {/* BOTTOM STORY */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-black mb-8 tracking-tight text-ink">The Architecture of Growth</h2>
          <p className="text-xl text-ink/80 leading-relaxed font-light mb-6">
            In an ever-changing technical landscape, staying sharp isn't an option—it's a strict requirement. We realized that while there are thousands of project management tools for <span className="font-semibold">teams</span>, there were zero specialized operating systems for the <span className="font-semibold">individual engineer's</span> long-term growth.
          </p>
          <p className="text-xl text-ink/80 leading-relaxed font-light">
            So we built it. Minimal friction, blazing fast speed, and absolute data clarity.
          </p>
        </motion.div>

      </main>
      
      <footer className="py-12 border-t border-line mt-auto bg-card relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" textClass="font-extrabold tracking-tight text-ink" />
          </div>
          <p className="text-muted text-sm font-medium">&copy; {new Date().getFullYear()} Premium Software Ltd. Built by SR Ahammad.</p>
        </div>
      </footer>
    </div>
  );
}
