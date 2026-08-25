import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { DEMO_USER_PROFILE } from '../data/skillsCatalog';
import { UserProfile } from '../types';
import { AvatarUpload, AVATAR_PRESETS } from './AvatarUpload';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onLoginSuccess?: (user: UserProfile) => void;
  onAuthSuccess?: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onLoginSuccess,
  onAuthSuccess,
}) => {
  const triggerAuthSuccess = (user: UserProfile) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [signUpAvatar, setSignUpAvatar] = useState(AVATAR_PRESETS[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Reset all input fields completely on open/close to maintain strict privacy
  const resetAllFields = () => {
    setSignInEmail('');
    setSignInPassword('');
    setSignInError('');
    setShowSignInPassword(false);
    setFullName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setConfirmPassword('');
    setUniversity('');
    setDepartment('');
    setSignUpAvatar(AVATAR_PRESETS[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setShowAvatarPicker(false);
    setSignUpError('');
    setShowSignUpPassword(false);
    setIsSuccess(false);
    setSuccessMsg('');
  };

  useEffect(() => {
    setMode(initialMode);
    resetAllFields();
  }, [initialMode, isOpen]);

  const handleClose = () => {
    resetAllFields();
    onClose();
  };

  if (!isOpen) return null;

  // Password evaluation for visual guidance
  const hasMinLength = signUpPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(signUpPassword);
  const hasLowercase = /[a-z]/.test(signUpPassword);
  const hasNumber = /[0-9]/.test(signUpPassword);
  const passwordsMatch = signUpPassword.length > 0 && confirmPassword.length > 0 && signUpPassword === confirmPassword;

  // Password strength score 0-4
  const strengthCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;
  
  let strengthLabel = 'BASIC';
  let strengthColor = 'bg-slate-600 text-slate-300';
  let strengthWidth = 'w-1/4';
  
  if (strengthCount === 2) {
    strengthLabel = 'FAIR';
    strengthColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    strengthWidth = 'w-2/4';
  } else if (strengthCount === 3) {
    strengthLabel = 'GOOD';
    strengthColor = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
    strengthWidth = 'w-3/4';
  } else if (strengthCount === 4) {
    strengthLabel = 'STRONG';
    strengthColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    strengthWidth = 'w-full';
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    const cleanEmail = signInEmail.trim().toLowerCase();
    if (!cleanEmail || !signInPassword) {
      setSignInError('Please fill in both email and password.');
      return;
    }

    // Check if stored in localStorage or match demo
    const storedUsersJson = localStorage.getItem('projectmatch_users');
    const users: UserProfile[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (found) {
      setIsSuccess(true);
      setSuccessMsg(`Welcome back, ${found.fullName}!`);
      setTimeout(() => {
        triggerAuthSuccess(found);
        onClose();
      }, 500);
      return;
    } 
    
    if (cleanEmail.includes('demo') || cleanEmail.includes('alex')) {
      setIsSuccess(true);
      setSuccessMsg('Welcome back, Alex!');
      setTimeout(() => {
        triggerAuthSuccess(DEMO_USER_PROFILE as unknown as UserProfile);
        onClose();
      }, 500);
      return;
    }

    // Seamless sign in: create or restore profile on the fly
    const nameDerived = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const newProfile: UserProfile = {
      ...DEMO_USER_PROFILE as unknown as UserProfile,
      id: `user-${Date.now()}`,
      fullName: nameDerived || 'TeamForge Member',
      email: cleanEmail,
      isRealUser: true,
      completionPercentage: 85,
    };

    users.push(newProfile);
    localStorage.setItem('projectmatch_users', JSON.stringify(users));

    setIsSuccess(true);
    setSuccessMsg(`Welcome to TeamForge AI, ${newProfile.fullName}!`);
    setTimeout(() => {
      triggerAuthSuccess(newProfile);
      onClose();
    }, 500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    const cleanName = fullName.trim();
    const cleanEmail = signUpEmail.trim().toLowerCase();

    if (!cleanName) {
      setSignUpError('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setSignUpError('Please enter a valid email address.');
      return;
    }

    if (!signUpPassword) {
      setSignUpError('Please choose a password.');
      return;
    }

    if (signUpPassword.length < 4) {
      setSignUpError('Password must be at least 4 characters long.');
      return;
    }

    if (confirmPassword && signUpPassword !== confirmPassword) {
      setSignUpError('Passwords do not match. Please verify your password.');
      return;
    }

    // Generate random suitable avatar
    const avatarSeeds = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
    ];
    const chosenAvatar = signUpAvatar || avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)];

    // Create user profile
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: cleanName,
      email: cleanEmail,
      university: university.trim() || 'Stanford University',
      department: department.trim() || 'Computer Science & AI',
      year: 'Senior (Year 4)',
      avatar: chosenAvatar,
      bio: `Hi, I'm ${cleanName}. Excited to collaborate on high-impact AI, software, and innovative hackathon projects!`,
      skills: [
        { name: 'Python', level: 88, interest: 92, category: 'AI & ML', verified: true },
        { name: 'TypeScript / React', level: 85, interest: 88, category: 'Frontend & UX', verified: true },
        { name: 'FastAPI & Backend', level: 82, interest: 85, category: 'Backend & Cloud', verified: true },
        { name: 'Data Structures', level: 86, interest: 80, category: 'Engineering' }
      ],
      interests: ['AI / ML', 'Full-Stack Engineering', 'Product Innovation', 'Hackathons'],
      preferredRoles: ['Full Stack Developer', 'AI/ML Engineer'],
      projects: [
        {
          id: `p-${Date.now()}`,
          name: 'AI Agent Collaboration Platform',
          description: 'Intelligent multi-agent framework designed for real-time task orchestration.',
          technologies: ['Python', 'FastAPI', 'React', 'TailwindCSS'],
          role: 'Lead Architect'
        }
      ],
      hackathonsWon: 1,
      certifications: ['AWS Cloud Practitioner'],
      achievements: ['Dean\'s Honor List 2024'],
      yearsOfExperience: 2,
      availability: {
        hoursPerWeek: 25,
        preferredTimezone: 'UTC-8 (PST)',
        weekendAvailability: true,
        days: {
          Monday: { morning: true, afternoon: true, evening: true, night: false },
          Tuesday: { morning: true, afternoon: true, evening: true, night: false },
          Wednesday: { morning: true, afternoon: true, evening: true, night: false },
          Thursday: { morning: true, afternoon: true, evening: true, night: false },
          Friday: { morning: true, afternoon: true, evening: true, night: false },
          Saturday: { morning: true, afternoon: true, evening: true, night: false },
          Sunday: { morning: false, afternoon: true, evening: true, night: false },
        },
        customHoursPerWeek: 25
      },
      completionPercentage: 88,
      teamDNA: {
        technicalStrength: 88,
        design: 74,
        research: 82,
        leadership: 80,
        collaboration: 90
      },
      isRealUser: true,
      githubUrl: `https://github.com/${cleanName.toLowerCase().replace(/\s+/g, '')}`,
      linkedinUrl: `https://linkedin.com/in/${cleanName.toLowerCase().replace(/\s+/g, '-')}`,
    };

    // Save to localStorage
    const storedUsersJson = localStorage.getItem('projectmatch_users');
    const users: UserProfile[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    
    // Replace if exists with same email or push
    const existingIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (existingIdx >= 0) {
      users[existingIdx] = newProfile;
    } else {
      users.push(newProfile);
    }
    
    localStorage.setItem('projectmatch_users', JSON.stringify(users));
    localStorage.setItem('projectmatch_user', JSON.stringify(newProfile));

    setIsSuccess(true);
    setSuccessMsg(`Account created successfully! Welcome, ${cleanName}.`);
    
    setTimeout(() => {
      triggerAuthSuccess(newProfile);
      resetAllFields();
      onClose();
    }, 600);
  };

  const handleDemoUser = () => {
    setIsSuccess(true);
    setSuccessMsg('Loaded 10-Minute Demo Sandbox (Alex Chen)');
    setTimeout(() => {
      triggerAuthSuccess({ ...(DEMO_USER_PROFILE as unknown as UserProfile), isDemo: true });
      resetAllFields();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#11182B] border border-[#263550] rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#263550] flex items-center justify-between bg-[#17213A]/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                {mode === 'signin' ? 'Sign in to TeamForge AI' : 'Create an Account'}
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              {mode === 'signin' 
                ? 'Access your team intelligence workspace & projects'
                : 'Join the student intelligence network & discover squads'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2942] transition-colors cursor-pointer"
           aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-[#263550] bg-[#0B1020]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setSignInError(''); setSignUpError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-colors border-b-2 cursor-pointer ${
              mode === 'signin'
                ? 'border-[#38BDF8] text-[#38BDF8] bg-[#17213A]/50'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setSignInError(''); setSignUpError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-colors border-b-2 cursor-pointer ${
              mode === 'signup'
                ? 'border-[#38BDF8] text-[#38BDF8] bg-[#17213A]/50'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Fast-Track Demo Banner */}
        <div className="px-5 py-2.5 bg-[#1D2942]/60 border-b border-[#263550] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
            <ShieldCheck className="w-4 h-4 text-[#22D3EE] shrink-0" />
            <span className="text-[11px] sm:text-xs">Quick Demo Experience:</span>
          </div>
          <button
            id="auth-continue-demo-btn"
            onClick={handleDemoUser}
            className="px-2.5 py-1 text-[11px] font-semibold text-[#0B1020] bg-[#22D3EE] hover:bg-[#38BDF8] rounded-lg transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <span>Continue as Demo User</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 mb-4 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <div className="font-bold text-emerald-200">Success!</div>
                <div>{successMsg}</div>
              </div>
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              {signInError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{signInError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    id="signin-email-input"
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="alex.chen@stanford.edu"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSignInEmail('alex.chen@stanford.edu');
                      setSignInPassword('password123');
                    }}
                    className="text-[11px] text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    Autofill Demo Creds
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    id="signin-password-input"
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="signin-submit-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-sm text-[#0B1020] bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-[#38BDF8]/10 cursor-pointer"
              >
                Sign In
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-[#94A3B8]">Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs font-semibold text-[#38BDF8] hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {signUpError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{signUpError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Full Name <span className="text-[#38BDF8]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rohinish Verma"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Email Address <span className="text-[#38BDF8]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="name@university.edu or email@domain.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                    University / School
                  </label>
                  <input
                    id="signup-university-input"
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                    Department / Major
                  </label>
                  <input
                    id="signup-dept-input"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              {/* Profile Picture Option in Sign Up */}
              <div className="p-3 bg-[#0B1020] border border-[#263550] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={signUpAvatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-lg object-cover border border-[#38BDF8]/50"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#F8FAFC] block">Profile Picture</span>
                      <span className="text-[10px] text-[#94A3B8]">Upload custom photo, take selfie, or use preset</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-[#38BDF8] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 rounded-lg transition-colors cursor-pointer"
                  >
                    {showAvatarPicker ? 'Hide Picker' : 'Customize Photo'}
                  </button>
                </div>

                {showAvatarPicker && (
                  <div className="pt-2 border-t border-[#17213A]">
                    <AvatarUpload
                      currentAvatar={signUpAvatar}
                      onAvatarChange={setSignUpAvatar}
                      userName={fullName || 'New User'}
                      size="sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Password <span className="text-[#38BDF8]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="signup-password-input"
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create a password (min. 4 chars)"
                    className="w-full pl-9 pr-10 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {signUpPassword && (
                  <div className="mt-2 p-2 rounded-xl bg-[#0B1020] border border-[#263550] space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-semibold">
                      <span className="text-[#94A3B8]">Security Strength</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${strengthColor}`}>
                        {strengthLabel}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strengthWidth} ${
                        strengthCount <= 1 ? 'bg-rose-500' :
                        strengthCount === 2 ? 'bg-amber-500' :
                        strengthCount === 3 ? 'bg-cyan-400' : 'bg-emerald-400'
                      }`} />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    id="signup-confirm-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full pl-9 pr-3 py-2 bg-[#0B1020] border rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none transition-colors ${
                      confirmPassword && !passwordsMatch 
                        ? 'border-rose-500/70 focus:border-rose-500' 
                        : 'border-[#263550] focus:border-[#38BDF8]'
                    }`}
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] text-rose-400 mt-1">Passwords do not match.</p>
                )}
              </div>

              <button
                id="signup-submit-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-sm text-[#0B1020] bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-[#38BDF8]/15 mt-2 cursor-pointer"
              >
                Create Account & Get Started
              </button>

              <div className="pt-1 text-center">
                <span className="text-xs text-[#94A3B8]">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs font-semibold text-[#38BDF8] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
