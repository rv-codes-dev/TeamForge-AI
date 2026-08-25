import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  Clock, 
  Copy, 
  Send,
  User,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

interface DemoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: (demoData: { email: string; fullName: string }) => void;
  onOpenSignUp?: () => void;
  onOpenSignIn?: () => void;
}

export const DemoVerificationModal: React.FC<DemoVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationSuccess,
  onOpenSignUp,
  onOpenSignIn,
}) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showSimulatedEmailToast, setShowSimulatedEmailToast] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail('');
      setFullName('');
      setGeneratedCode('');
      setCodeDigits(['', '', '', '', '', '']);
      setErrorMsg('');
      setIsSending(false);
      setIsVerifying(false);
      setResendCountdown(0);
      setShowSimulatedEmailToast(false);
    }
  }, [isOpen]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  if (!isOpen) return null;

  // Generate a random 6-digit OTP code
  const generateNewCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address (e.g., student@university.edu).');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const newOtp = generateNewCode();
      setGeneratedCode(newOtp);
      setCodeDigits(['', '', '', '', '', '']);
      setStep('code');
      setIsSending(false);
      setResendCountdown(45);
      setShowSimulatedEmailToast(true);

      // Focus first digit box after transition
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 150);
    }, 600);
  };

  const handleResendCode = () => {
    if (resendCountdown > 0) return;
    setErrorMsg('');
    setIsSending(true);

    setTimeout(() => {
      const newOtp = generateNewCode();
      setGeneratedCode(newOtp);
      setCodeDigits(['', '', '', '', '', '']);
      setIsSending(false);
      setResendCountdown(45);
      setShowSimulatedEmailToast(true);

      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 500);
  };

  const handleDigitChange = (index: number, val: string) => {
    setErrorMsg('');
    const sanitized = val.replace(/[^0-9]/g, '');
    
    // If pasting multiple digits
    if (sanitized.length > 1) {
      const digits = sanitized.slice(0, 6).split('');
      const newDigits = [...codeDigits];
      digits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setCodeDigits(newDigits);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...codeDigits];
    newDigits[index] = sanitized;
    setCodeDigits(newDigits);

    // Auto-advance to next input
    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillCode = () => {
    if (!generatedCode) return;
    const digits = generatedCode.split('');
    setCodeDigits(digits);
    setErrorMsg('');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleVerifyAndLaunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const enteredCode = codeDigits.join('');
    if (enteredCode.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    if (enteredCode !== generatedCode) {
      setErrorMsg('Invalid verification code. Please check the code sent to your email.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onVerificationSuccess({
        email: email.trim().toLowerCase(),
        fullName: fullName.trim() || 'Demo Explorer',
      });
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#11182B] border-2 border-[#38BDF8]/40 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#8B5CF6]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#17213A] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2942] transition-colors z-20 cursor-pointer"
         aria-label="Close">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] shadow-md shadow-[#38BDF8]/10 mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
              {step === 'email' ? 'Launch 10-Min Demo' : 'Enter Verification Code'}
            </h2>
            
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
              {step === 'email' 
                ? 'Enter your email address to receive a 6-digit access code for the live squad orchestration sandbox.' 
                : (
                  <span>
                    We sent a 6-digit verification code to <strong className="text-[#38BDF8]">{email}</strong>.
                  </span>
                )}
            </p>
          </div>

          {/* Simulated Email Notification Toast Preview */}
          {step === 'code' && showSimulatedEmailToast && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#17213A] to-[#1E293B] border border-[#38BDF8]/40 shadow-lg space-y-2 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#38BDF8]">
                  <Mail className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Inbox Simulation Dispatch</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Delivered
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-[#0B1020] p-2.5 rounded-xl border border-[#263550]">
                <div>
                  <div className="text-[10px] text-[#94A3B8]">Your 6-Digit Code:</div>
                  <div className="text-lg font-mono font-black text-[#F8FAFC] tracking-widest mt-0.5">
                    {generatedCode}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillCode}
                  className="px-3 py-1.5 rounded-lg bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 border border-[#38BDF8]/40 text-[#38BDF8] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Filled!' : 'Auto-Fill'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Email Input Form */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#CBD5E1]">
                  Your Name <span className="text-[#94A3B8] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#CBD5E1]">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              {/* Demo Session Notice Box */}
              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#263550] text-[11px] text-[#94A3B8] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#38BDF8] font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>10-Minute Sandbox Preview</span>
                </div>
                <p>
                  You will gain instant access to flagship AI squad matching, stress-testing, and member requests.
                </p>
              </div>

              <button
                type="submit"
                id="demo-send-code-btn"
                disabled={isSending}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#818CF8] hover:opacity-95 text-[#0B1020] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#38BDF8]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#0B1020]" />
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4 text-[#0B1020]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: 6-Digit Code Input Form */}
          {step === 'code' && (
            <form onSubmit={handleVerifyAndLaunch} className="space-y-5">
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-center text-[#CBD5E1]">
                  Enter 6-Digit Verification Code
                </label>
                
                {/* 6 Digit Input Boxes */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-mono font-black rounded-xl bg-[#0B1020] border transition-all focus:outline-none ${
                        digit
                          ? 'border-[#38BDF8] text-[#38BDF8] shadow-md shadow-[#38BDF8]/20'
                          : 'border-[#263550] text-[#F8FAFC] focus:border-[#38BDF8]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend Code & Change Email Controls */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setErrorMsg('');
                  }}
                  className="text-[#94A3B8] hover:text-[#CBD5E1] transition-colors cursor-pointer"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  disabled={resendCountdown > 0 || isSending}
                  onClick={handleResendCode}
                  className={`font-semibold transition-colors cursor-pointer ${
                    resendCountdown > 0 
                      ? 'text-[#94A3B8]/60 cursor-not-allowed' 
                      : 'text-[#38BDF8] hover:underline'
                  }`}
                >
                  {resendCountdown > 0 ? `Resend Code in ${resendCountdown}s` : 'Resend Code'}
                </button>
              </div>

              {/* Submit Verification Button */}
              <button
                type="submit"
                id="demo-verify-code-btn"
                disabled={isVerifying || codeDigits.some(d => !d)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-[#38BDF8] hover:opacity-95 text-[#0B1020] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Verify Code & Start 10-Min Demo</span>
                  </>
                )}
              </button>

            </form>
          )}

          {/* Quick Sign-In Footer Links */}
          <div className="pt-2 border-t border-[#263550] text-center text-xs text-[#94A3B8] flex items-center justify-center gap-2">
            <span>Already have an account?</span>
            {onOpenSignIn && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSignIn();
                }}
                className="text-[#38BDF8] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
