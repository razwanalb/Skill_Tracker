import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Monitor, Smartphone, Apple, Download as DownloadIcon, ChevronRight, X, Info } from 'lucide-react';
import { Logo } from '../components/Logo';

export function Download() {
  const [showPopup, setShowPopup] = useState(false);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-ink flex flex-col relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[30%] -right-[10%] w-[900px] h-[900px] bg-accent/10 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -left-[20%] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[130px]"
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
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 lg:py-32 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-8">
            <DownloadIcon className="w-4 h-4" />
            Native Clients Available
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-ink">
            Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Everywhere</span>.
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-20 max-w-2xl mx-auto leading-relaxed font-light">
            Engineered natively for every platform. Experience zero-latency tracking, offline support, and seamless cross-device syncing.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Desktop App */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="p-10 bg-gradient-to-br from-card to-card/50 border border-line rounded-[2.5rem] shadow-2xl shadow-black/5 text-left group relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-3xl font-black mb-2 text-ink">Desktop</h3>
                  <p className="text-muted font-medium">macOS, Windows, Linux</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                   <Monitor className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
              
              <p className="text-lg text-ink/80 mb-10 leading-relaxed min-h-[80px]">
                Experience raw power. Features global keyboard shortcuts, local-first offline mode, and deep OS widget integration.
              </p>
              
              <button onClick={handleDownloadClick} className="w-full py-5 px-6 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all flex justify-center items-center gap-2 shadow-lg shadow-primary/30 group-hover:shadow-primary/50">
                <DownloadIcon className="w-5 h-5"/> Download for Windows
              </button>
              
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary font-bold justify-center opacity-80">
                <button onClick={handleDownloadClick} className="hover:underline flex items-center gap-1">Mac (Apple Silicon) <ChevronRight className="w-3 h-3"/></button>
                <button onClick={handleDownloadClick} className="hover:underline flex items-center gap-1">Mac (Intel) <ChevronRight className="w-3 h-3"/></button>
                <button onClick={handleDownloadClick} className="hover:underline flex items-center gap-1">Linux (.deb) <ChevronRight className="w-3 h-3"/></button>
              </div>
            </motion.div>

            {/* Mobile App */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="p-10 bg-gradient-to-br from-card to-card/50 border border-line rounded-[2.5rem] shadow-2xl shadow-black/5 text-left group relative overflow-hidden mt-0 md:mt-16"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[50px] group-hover:bg-accent/20 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-3xl font-black mb-2 text-ink">Mobile</h3>
                  <p className="text-muted font-medium">iOS & Android</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                </div>
              </div>
              
              <p className="text-lg text-ink/80 mb-10 leading-relaxed min-h-[80px]">
                Capture habits in the moment. Never lose your streak with intelligent push notifications and interactive lock screen widgets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleDownloadClick} className="flex-1 py-5 px-6 bg-ink text-surface rounded-2xl font-bold hover:bg-ink/90 transition-all shadow-lg flex justify-center items-center gap-2">
                   <Apple className="w-5 h-5"/> App Store
                </button>
                <button onClick={handleDownloadClick} className="flex-1 py-5 px-6 border-2 border-line text-ink rounded-2xl font-bold hover:bg-line/50 transition-all flex justify-center items-center gap-2 bg-surface">
                  Google Play
                </button>
              </div>
              
              <div className="mt-6 flex gap-4 text-sm text-accent font-bold justify-center opacity-80">
                <span className="flex items-center gap-1">Requires iOS 15+ or Android 10+</span>
              </div>
            </motion.div>

          </div>
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

      {/* Major Update Modal */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-line rounded-[2rem] shadow-2xl p-8 md:p-10 overflow-hidden text-center"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
              
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-line/50 text-muted hover:text-ink transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Info className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-3xl font-black text-ink mb-4 tracking-tight">Major Update in Progress</h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                We are currently undergoing a massive architectural upgrade to bring you the next generation of native mobile and desktop clients! Downloads are temporarily suspended while we deploy our new ultra-fast global infrastructure.
              </p>
              
              <div className="inline-block bg-primary/5 border border-primary/20 rounded-2xl p-4 text-primary font-medium text-sm">
                Check back shortly. Greatness takes time! 🚀
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
