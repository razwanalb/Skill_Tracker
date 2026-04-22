import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ListChecks, ArrowRight, Mail, Lock, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useFirebase } from '../components/FirebaseProvider';
import { Logo } from '../components/Logo';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { signUpWithEmail } = useFirebase();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      setErrorMsg("Please accept the terms and conditions");
      return;
    }

    try {
      setErrorMsg('');
      await signUpWithEmail(email, password, name);
      navigate('/');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex bg-surface font-sans">
      {/* Left Column (Brand / Visual) - Match Login */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1a237e] via-primary-dark to-primary relative overflow-hidden items-center justify-center p-12">
        <motion.div 
          className="absolute top-[30%] right-[10%] w-72 h-72 bg-accent/30 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[20%] w-96 h-96 bg-[#42a5f5]/30 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.4, 1], x: [0, 50, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative z-10 w-full max-w-xl text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 drop-shadow-2xl">
              <Logo className="w-20 h-20" textClass="hidden" showText={false} />
            </div>
            
            <h1 className="text-6xl font-black mb-6 leading-[1.1] tracking-tight">
              Start Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#ff7eb3]">
                Journey Here
              </span>
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed font-light mb-12 max-w-lg">
              Join thousands of developers tracking their skills and optimizing their routines every single day.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative bg-surface overflow-y-auto">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--color-line) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>
        
        <motion.div 
          className="w-full max-w-md relative z-10 my-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Logo className="w-16 h-16 mb-5" textClass="text-4xl font-extrabold text-ink tracking-tight" />
          </div>

          <div className="mb-8 lg:text-left text-center">
            <h2 className="text-[2.5rem] font-bold text-ink mb-2 tracking-tight leading-tight">Create Account</h2>
            <p className="text-muted text-base">Sign up to start organizing your life.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-error/10 text-error border border-error/20 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <UserIcon className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-card border border-line rounded-xl text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm text-[15px]"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-card border border-line rounded-xl text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm text-[15px]"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-card border border-line rounded-xl text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm text-[15px]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted hover:text-primary transition-colors outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-card border border-line rounded-xl text-ink focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm text-[15px]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 rounded border-line bg-card text-primary focus:ring-primary/20 focus:ring-2 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-ink/80 cursor-pointer">
                  I accept the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="mt-4 group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl text-white font-bold text-[15px] bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md shadow-primary/30 hover:-translate-y-[1px]"
            >
              Create Account
              <motion.div animate={{ x: isHovered ? 6 : 0 }}>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </button>
          </form>

          <div className="mt-8 mb-4 text-center text-[15px] text-muted font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
