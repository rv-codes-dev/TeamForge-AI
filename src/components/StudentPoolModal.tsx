import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Users, 
  Trophy, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import { StudentProfile, ProjectDNA } from '../types';
import { MOCK_STUDENTS } from '../data/mockStudents';

interface StudentPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: StudentProfile) => void;
  activeProjectDNA?: ProjectDNA;
  activeTeam?: StudentProfile[];
}

export const StudentPoolModal: React.FC<StudentPoolModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  activeProjectDNA,
  activeTeam = [],
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const categories = [
    'All',
    'AI & ML',
    'Frontend & UX',
    'Backend & Cloud',
    'Domain & Research',
    'Security & Systems',
    'Product & Management',
  ];

  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === 'All' ||
      student.skills.some((s) => s.category === selectedCategoryFilter);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="w-full max-w-5xl max-h-[90vh] bg-[#050505]/90 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Student Talent Pool ({MOCK_STUDENTS.length} Profiles)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 font-mono">
                  Synthetic demo profiles — prototype data
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified student candidates with cross-functional AI, engineering, domain, and product skillsets.
              </p>
            </div>
          </div>

          <button
            id="close-student-pool-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 bg-white/[0.01] border-b border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, skill (Python, React, CV, Figma...), role, university..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border backdrop-blur-sm ${
                    selectedCategoryFilter === cat
                      ? 'bg-blue-600 text-white border-blue-400 shadow-sm shadow-blue-600/20'
                      : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const isInActiveTeam = activeTeam.some((m) => m.id === student.id);

            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="p-4 rounded-2xl bg-black/30 hover:bg-black/40 border border-white/10 hover:border-blue-500/40 backdrop-blur-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-xl object-cover border border-white/20 group-hover:border-cyan-400 transition-colors shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white tracking-tight">
                            {student.name}
                          </h4>
                          {isInActiveTeam && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                              Active Squad
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-blue-300 font-medium">
                          {student.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {student.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {student.skills.slice(0, 3).map((s) => (
                      <span
                        key={s.name}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 font-mono backdrop-blur-sm"
                      >
                        {s.name} <strong className="text-cyan-300">{s.level}%</strong>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{student.university.split(' ')[0]}</span>
                  <span className="font-mono text-emerald-400 font-semibold">{student.availability.hoursPerWeek} hrs/wk</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
