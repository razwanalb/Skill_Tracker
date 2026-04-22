import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Camera, Save, User, Mail, Phone, MapPin, Link as LinkIcon, Github, ShieldCheck, Sparkles, LogOut, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useFirebase } from '../components/FirebaseProvider';
import { useNavigate } from 'react-router-dom';

// Local avatar paths (stored in public/avatars/)
const MALE_NAMES = ['felix', 'jack', 'liam', 'noah', 'oliver', 'elijah', 'james'];
const FEMALE_NAMES = ['aneka', 'lilly', 'mia', 'sophia', 'isabella', 'ava', 'emma'];
const PREMIUM_NAMES = ['king', 'alpha', 'pro', 'legend', 'master', 'prince', 'duke', 'maximus', 'hero', 'ace'];

const ALL_AVATARS = [
  ...MALE_NAMES.map(name => `/avatars/male_${name}.svg`),
  ...FEMALE_NAMES.map(name => `/avatars/female_${name}.svg`)
];

const PREMIUM_AVATARS = PREMIUM_NAMES.map(name => `/avatars/premium_${name}.svg`);

export function Profile() {
  const user = useStore(state => state.user);
  const updateProfile = useStore(state => state.updateProfile);
  const { signOut } = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    location: user?.location || '',
    website: user?.website || '',
    socialLink: user?.socialLink || '',
  });

  const [avatar, setAvatar] = useState(user?.profilePicture || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [showAvatarGrid, setShowAvatarGrid] = useState(false);

  // Sync avatar when user state updates from backend to keep it permanent visually
  React.useEffect(() => {
    if (user?.profilePicture && user.profilePicture !== avatar) {
      setAvatar(user.profilePicture);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.profilePicture]);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      profilePicture: avatar,
    });
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Helper for input styles
  const inputClass = "w-full px-4 py-3 bg-surface border border-line rounded-xl text-ink focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:font-normal placeholder:text-muted/60";
  const labelClass = "block text-sm font-semibold text-ink/80 mb-2 flex items-center gap-2";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto w-full pb-10"
    >
      {/* Header section w/ optional sparkle */}
      <div className="mb-8 pl-2">
        <h1 className="text-3xl font-bold tracking-tight text-ink flex items-center gap-2">
          Profile Settings
          <Sparkles className="w-6 h-6 text-primary" />
        </h1>
        <p className="text-muted mt-2 text-base">Manage your personal information, contact details, and public presence.</p>
      </div>

      <div className="bg-card rounded-3xl shadow-sm border border-line overflow-hidden">
        {/* Cover Banner */}
        <div className="h-40 w-full bg-gradient-to-r from-primary/80 via-purple-500/80 to-blue-500/80 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
        </div>

        <form onSubmit={handleSave} className="px-6 sm:px-10 pb-10 relative">
          
          {/* Avatar Section (Overlapping) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20 mb-10">
            <div className="relative group cursor-pointer shadow-xl rounded-full" onClick={() => setShowAvatarGrid(!showAvatarGrid)}>
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-surface border-4 sm:border-[6px] border-card flex items-center justify-center relative shadow-inner">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-primary">{user.name?.charAt(0) || 'U'}</span>
                )}
                
                {/* Camera Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white gap-2">
                  <Camera className="w-8 h-8" />
                  <span className="text-xs font-semibold tracking-wider">CHANGE AI AVATAR</span>
                </div>
              </div>
            </div>
            
            <div className="text-center sm:text-left flex-1 mb-2 sm:mb-4">
              <h3 className="text-2xl font-bold text-ink flex items-center justify-center sm:justify-start gap-1.5">
                <span>{formData.name || 'Your Name'}</span>
                {user?.email === 'razwan.self@gmail.com' && (
                  <BadgeCheck className="w-6 h-6 text-blue-500" fill="currentColor" stroke="white" title="Verified Account" />
                )}
              </h3>
              <p className="text-primary font-medium">{formData.username ? `@${formData.username}` : user.email}</p>
            </div>
          </div>

          {/* Avatar Grid Selection */}
          {showAvatarGrid && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-10 overflow-hidden"
            >
              <div className="bg-surface border border-line rounded-2xl p-6">
                <h4 className="text-sm font-bold text-ink mb-4">
                  {user?.email === 'razwan.self@gmail.com' ? 'Choose a Premium AI Avatar (Exclusive)' : 'Choose an AI Avatar'}
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                  {(user?.email === 'razwan.self@gmail.com' ? PREMIUM_AVATARS : ALL_AVATARS).map((url, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setAvatar(url);
                        setShowAvatarGrid(false);
                      }}
                      className={`cursor-pointer rounded-full overflow-hidden border-4 transition-all duration-200 hover:scale-110 ${avatar === url ? 'border-primary shadow-lg shadow-primary/30 scale-110' : 'border-transparent hover:border-primary/50'}`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-auto object-cover bg-white" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setAvatar('')} 
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Remove Avatar completely
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Personal Info Column */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="mb-6 pb-2 border-b border-line/50">
                <h4 className="font-bold text-lg flex items-center gap-2 text-ink">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h4>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className={labelClass}>Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted font-bold">@</div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`${inputClass} pl-9`}
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Contact & Links Column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="mb-6 pb-2 border-b border-line/50">
                <h4 className="font-bold text-lg flex items-center gap-2 text-ink">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact & Links
                </h4>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>
                    Email Address
                    <span title="Verified" className="ml-auto flex items-center">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${inputClass} opacity-70 bg-line/30 cursor-not-allowed`}
                    readOnly
                    title="Email cannot be changed directly"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                          <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                          <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Website Url</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                        <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Social Profile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                        <Github className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="socialLink"
                      value={formData.socialLink}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="GitHub, Twitter, or LinkedIn URL"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-6 w-full sm:w-auto flex items-center justify-center sm:justify-start">
              {successMsg ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-success font-semibold flex items-center gap-2 bg-success/10 px-4 py-2 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  {successMsg}
                </motion.div>
              ) : null}
            </div>
            
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Save className="w-5 h-5" />
                Save Profile Details
              </button>
            </div>
          </div>
          
        </form>
      </div>
    </motion.div>
  );
}
