import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Privacy() {
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
          <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
          <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="mb-4 text-ink/80 leading-relaxed">
              We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, password, and other information you choose to provide.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Sharing of Information</h2>
            <p className="mb-4 text-ink/80 leading-relaxed">
              We do not share your personal data with third parties for their direct marketing purposes. We do share your information with third-party service providers (like Firebase) that provide services on our behalf, such as hosting, database management, and authentication.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p className="mb-4 text-ink/80 leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Contact Us</h2>
            <p className="mb-4 text-ink/80 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@skilltracker.example.com.
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
