import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  BookOpen, 
  Sparkles, 
  Github, 
  Linkedin, 
  Globe, 
  Clock, 
  Award, 
  Briefcase, 
  Check, 
  Edit3, 
  X, 
  ShieldCheck,
  TrendingUp,
  Camera
} from 'lucide-react';
import { UserProfile } from '../types';
import { AvatarUpload } from './AvatarUpload';

interface UserProfileViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onEditProfile: () => void;
  onUpdateAvatar?: (newAvatar: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  isOpen,
  onClose,
  currentUser,
  onEditProfile,
  onUpdateAvatar,
}) => {
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);

  if (!isOpen) return null;

  const dna = currentUser.teamDNA || {
    technicalStrength: 92,
    design: 68,
    research: 86,
    leadership: 84,
    collaboration: 90
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11182B] border border-[#263550] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#17213A] border-b border-[#263550] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setShowAvatarEditor(!showAvatarEditor)}
              className="relative group cursor-pointer"
              title="Click to change profile picture"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#38BDF8] group-hover:opacity-80 transition-all shadow-md shadow-[#38BDF8]/20"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#38BDF8] text-[#0B1020] text-[9px] font-bold shadow">
                <Camera className="w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">{currentUser.fullName}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                  {currentUser.isRealUser ? 'REAL USER PROFILE' : 'SYNTHETIC DEMO PROFILE'}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {currentUser.department} • {currentUser.university} ({currentUser.year})
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#CBD5E1]">
                {currentUser.githubUrl && (
                  <a href={currentUser.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#38BDF8] transition-colors">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {currentUser.linkedinUrl && (
                  <a href={currentUser.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#38BDF8] transition-colors">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {currentUser.portfolioUrl && (
                  <a href={currentUser.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#22D3EE] transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="profile-edit-btn"
              onClick={onEditProfile}
              className="px-3 py-1.5 rounded-xl bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/40 flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2942] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Avatar Change Section */}
          {showAvatarEditor && (
            <div className="p-4 rounded-2xl bg-[#0B1020] border-2 border-[#38BDF8]/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#38BDF8]" />
                  <span>Update Profile Picture</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAvatarEditor(false)}
                  className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Done
                </button>
              </div>

              <AvatarUpload
                currentAvatar={currentUser.avatar || ''}
                onAvatarChange={(newAv) => {
                  if (onUpdateAvatar) {
                    onUpdateAvatar(newAv);
                  }
                }}
                userName={currentUser.fullName}
              />
            </div>
          )}

          {/* Bio */}
          {currentUser.bio && (
            <div className="p-3.5 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#CBD5E1] leading-relaxed">
              <span className="font-bold text-[#F8FAFC] block mb-1">About</span>
              {currentUser.bio}
            </div>
          )}

          {/* Team DNA Vector */}
          <div className="p-4 bg-[#17213A]/70 border border-[#263550] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <h3 className="text-xs font-bold text-[#F8FAFC]">Your AI Team DNA Vector</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                Readiness: {currentUser.completionPercentage || 94}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-2.5 bg-[#0B1020] border border-[#263550] rounded-xl">
                <div className="flex justify-between text-[#CBD5E1] mb-1">
                  <span>Technical Strength</span>
                  <span className="font-mono text-[#38BDF8] font-bold">{dna.technicalStrength}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#38BDF8]" style={{ width: `${dna.technicalStrength}%` }} />
                </div>
              </div>

              <div className="p-2.5 bg-[#0B1020] border border-[#263550] rounded-xl">
                <div className="flex justify-between text-[#CBD5E1] mb-1">
                  <span>Design & Prototyping</span>
                  <span className="font-mono text-[#8B5CF6] font-bold">{dna.design}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8B5CF6]" style={{ width: `${dna.design}%` }} />
                </div>
              </div>

              <div className="p-2.5 bg-[#0B1020] border border-[#263550] rounded-xl">
                <div className="flex justify-between text-[#CBD5E1] mb-1">
                  <span>Research & Domain Depth</span>
                  <span className="font-mono text-[#22D3EE] font-bold">{dna.research}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#22D3EE]" style={{ width: `${dna.research}%` }} />
                </div>
              </div>

              <div className="p-2.5 bg-[#0B1020] border border-[#263550] rounded-xl">
                <div className="flex justify-between text-[#CBD5E1] mb-1">
                  <span>Leadership & Hackathons</span>
                  <span className="font-mono text-amber-400 font-bold">{dna.leadership}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${dna.leadership}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Dual-Vector Skills Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#F8FAFC]">
                Verified Skills & Interest Calibration ({currentUser.skills?.length || 0})
              </span>
              <span className="text-[10px] text-[#94A3B8]">
                Blue: Proficiency • Purple: Project Interest
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {currentUser.skills?.map(s => (
                <div key={s.name} className="p-3 bg-[#0B1020] border border-[#263550] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F8FAFC]">{s.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#17213A] text-[#38BDF8]">
                      {s.category}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span>Proficiency</span>
                      <span className="font-mono text-[#38BDF8] font-semibold">{s.level}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
                      <div className="h-full bg-[#38BDF8]" style={{ width: `${s.level}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span>Interest in using</span>
                      <span className="font-mono text-[#8B5CF6] font-semibold">{s.interest || 85}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
                      <div className="h-full bg-[#8B5CF6]" style={{ width: `${s.interest || 85}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#17213A]/50 border border-[#263550] rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-xs font-bold text-[#F8FAFC]">Weekly Commitment</span>
              </div>
              <div className="text-base font-mono font-bold text-[#38BDF8]">
                {currentUser.availability?.customHoursPerWeek || 30} Hours / Week
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                High bandwidth availability for sprints and competitive hackathons.
              </p>
            </div>

            <div className="p-3.5 bg-[#17213A]/50 border border-[#263550] rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-[#F8FAFC]">Hackathon Record</span>
              </div>
              <div className="text-base font-mono font-bold text-amber-400">
                {currentUser.hackathonsWon || 3} Wins / Placements
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Proven track record delivering end-to-end working software within 48h.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
