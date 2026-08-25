import React from 'react';
import { 
  X, 
  Trophy, 
  Clock, 
  GraduationCap, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Award, 
  Code,
  Github,
  Linkedin,
  Heart,
  ShieldCheck,
  Calendar,
  Zap
} from 'lucide-react';
import { StudentProfile, ProjectDNA } from '../types';

interface StudentProfileDrawerProps {
  student: StudentProfile | null;
  onClose: () => void;
  activeProjectDNA?: ProjectDNA;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  onClose,
  activeProjectDNA,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg h-full bg-[#050505]/95 border-l border-white/15 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        
        <div className="space-y-6">
          {/* Top Close */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Candidate Dossier
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 font-mono">
                Synthetic demo profiles — prototype data
              </span>
            </div>
            <button
              id="close-profile-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-sm transition-colors cursor-pointer"
             aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg"
            />
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {student.name}
              </h3>
              <p className="text-sm font-semibold text-cyan-300">
                {student.role}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {student.university} • {student.major} ({student.year})
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-slate-300 leading-relaxed backdrop-blur-sm">
            {student.bio}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sprint Bandwidth</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {student.availability.hoursPerWeek} hrs/week
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{student.availability.timezone} • {student.availability.status}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Hackathon Pedigree</span>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {student.experience.hackathonsWon} First-Place Wins
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{student.experience.years} Years Experience</span>
            </div>
          </div>

          {/* Flagship Achievement */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/25 text-xs backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Flagship Project Achievement</span>
            </div>
            <p className="text-slate-300">
              {student.experience.highlightProject}
            </p>
          </div>

          {/* SECTION 1: What the student is good at (Proficiency & Evidence) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demonstrated Competencies (What I'm Good At)</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Skill Evidence Level</span>
            </div>

            <div className="space-y-2.5">
              {student.skills.map((s, idx) => (
                <div key={s.name} className="p-3 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{s.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                        {idx === 0 ? 'Verified Flagship' : s.level >= 85 ? 'High Production' : 'Proficient'}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-cyan-300">{s.level}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: What the student wants to work on (Project Interest) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-purple-400" />
              <span>Domain Passions (What I Want to Work On)</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Passionate alignment factor (15% matching weight). High affinity yields superior hackathon engagement.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {student.projectInterests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-200 border border-purple-500/20 backdrop-blur-sm flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>{interest}</span>
                </span>
              ))}
            </div>
          </div>

          {/* SECTION 3: Availability & Timezone Details */}
          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sprint Availability Matrix</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">Weekday Commitment</span>
                <strong>~{Math.round(student.availability.hoursPerWeek * 0.6)} hours (Mon-Fri)</strong>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">Weekend Hack Sprint</span>
                <strong>~{Math.round(student.availability.hoursPerWeek * 0.4)} hours (Sat-Sun)</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10 mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-xs text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20"
          >
            Close Candidate Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
