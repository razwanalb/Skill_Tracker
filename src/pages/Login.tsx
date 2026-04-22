import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ListChecks, ArrowRight, Github, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useFirebase } from '../components/FirebaseProvider';
import { Logo } from '../components/Logo';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const { signIn, signInWithEmail, resetPassword, signInWithGithub } = useFirebase();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg('');
      await signIn();
      navigate('/');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to sign in with Google');
    }
  };

  const handleGithubLogin = async () => {
    try {
      setErrorMsg('');
      await signInWithGithub();
      navigate('/');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to sign in with GitHub');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      await signInWithEmail(email, password);
      navigate('/');
    } catch (e: any) {
      setErrorMsg('Invalid email or password');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg('Please enter your email to reset your password');
      return;
    }
    try {
      setErrorMsg('');
      await resetPassword(email);
      setResetMsg('Password reset email sent! Check your inbox.');
      setTimeout(() => setResetMsg(''), 5000);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex bg-surface font-sans">
      
      {/* Left Column (Brand / Visual) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary-dark to-[#1a237e] relative overflow-hidden items-center justify-center p-12">
        {/* Navigation for Landing Page */}
        <div className="absolute top-8 left-8 z-30 flex gap-8">
          <Link to="/about" className="text-white/80 hover:text-white font-semibold transition-colors">About</Link>
          <Link to="/download" className="text-white/80 hover:text-white font-semibold transition-colors">Download</Link>
        </div>

        {/* Abstract animated background elements */}
        <motion.div 
          className="absolute top-[20%] left-[10%] w-72 h-72 bg-accent/30 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#42a5f5]/30 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.5, 1], x: [0, -40, 0], y: [0, 50, 0] }}
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
              Master Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#ff7eb3]">
                Daily Routine
              </span>
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed font-light mb-12 max-w-lg">
              A professional OS designed for developers and lifelong learners to meticulously track skills, optimize routines, and visualize growth over time.
            </p>
            
            <div className="flex items-center gap-5">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-2 border-[#1a237e]" src="https://picsum.photos/seed/user1/100/100" referrerPolicy="no-referrer" alt="User 1" />
                <img className="w-12 h-12 rounded-full border-2 border-[#1a237e]" src="https://picsum.photos/seed/user2/100/100" referrerPolicy="no-referrer" alt="User 2" />
                <img className="w-12 h-12 rounded-full border-2 border-[#1a237e]" src="https://picsum.photos/seed/user3/100/100" referrerPolicy="no-referrer" alt="User 3" />
                <div className="w-12 h-12 rounded-full border-2 border-[#1a237e] bg-accent flex items-center justify-center text-sm font-bold text-white">
                  1k+
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-accent text-sm">
                  ★ ★ ★ ★ ★
                </div>
                <p className="text-sm text-white/80 font-medium">Join top-tier developers.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center p-8 sm:p-12 relative bg-surface overflow-y-auto min-h-screen">
        {/* Mobile Navigation */}
        <div className="lg:hidden absolute top-6 left-6 right-6 flex justify-between z-20">
          <Link to="/about" className="text-muted hover:text-ink font-semibold transition-colors text-sm">About</Link>
          <Link to="/download" className="text-muted hover:text-ink font-semibold transition-colors text-sm">Download</Link>
        </div>

        {/* Subtle dot pattern background on right side for extra texture */}
        <div className="absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(var(--color-line) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>
        
        <motion.div 
          className="w-full max-w-md relative z-10 m-auto flex flex-col pt-12 lg:pt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Logo className="w-16 h-16 mb-5" textClass="text-4xl font-extrabold text-ink tracking-tight" />
          </div>

          <div className="mb-8 lg:text-left text-center">
            <h2 className="text-[2.5rem] font-bold text-ink mb-2 tracking-tight leading-tight">Welcome Back</h2>
            <p className="text-muted text-base">Sign in to sync your data securely.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-error/10 text-error border border-error/20 rounded-xl text-sm font-bold flex items-center shadow-sm">
              <span className="mr-2">⚠️</span> {errorMsg}
            </div>
          )}

          {resetMsg && (
            <div className="mb-6 p-4 bg-success/10 text-success border border-success/20 rounded-xl text-sm font-bold flex items-center shadow-sm">
              <span className="mr-2">✉️</span> {resetMsg}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-5">
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
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-semibold text-ink">Password</label>
                  <button 
                    type="button" 
                    onClick={handleResetPassword}
                    className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
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
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl text-white font-bold text-[15px] bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md shadow-primary/30 hover:-translate-y-[1px]"
            >
              Sign In with Email
              <motion.div animate={{ x: isHovered ? 6 : 0 }}>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium">
                <span className="px-4 bg-surface text-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-card border border-line rounded-xl text-ink font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-sm hover:-translate-y-[1px] text-[15px]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              
              <button 
                onClick={handleGithubLogin}
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-ink text-surface border border-transparent rounded-xl font-semibold hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink transition-all shadow-sm hover:-translate-y-[1px] text-[15px]"
              >
                <Github className="w-5 h-5" />
                GitHub
              </button>
            </div>
          </div>
          <div className="mt-6 mb-8 text-center text-[15px] text-muted font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">
              Create an account
            </Link>
          </div>
        </motion.div>

        {/* Footer Links */}
        <div className="w-full max-w-md mx-auto mt-auto pb-6 relative z-10 flex justify-center gap-6 text-sm text-muted font-medium">
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
