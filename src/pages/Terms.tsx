import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen bg-surface font-sans text-ink flex flex-col">
      <header className="px-8 py-6 border-b border-line flex justify-between items-center bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/login" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-bold text-lg">
          <ArrowLeft className="w-5 h-5" />
          Back Home
        </Link>
      </header>
      
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full prose prose-ink prose-a:text-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
          <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4 text-ink/80 leading-relaxed">
              By accessing and using Skill Tracker, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. User Account and Security</h2>
            <p className="mb-4 text-ink/80 leading-relaxed">
              To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Privacy and Data Usage</h2>
            <p className="mb-4 text-ink/80 leading-relaxed">
              Your privacy is extremely important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Modifications to Service</h2>
            <p className="mb-4 text-ink/80 leading-relaxed">
              We reserve the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
            </p>
          </section>
        </motion.div>
      </main>
      
      <footer className="py-8 text-center text-muted border-t border-line mt-auto">
        <p>&copy; {new Date().getFullYear()} Skill Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
