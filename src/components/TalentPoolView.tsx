import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  Award, 
  CheckCircle2, 
  Plus, 
  Scale, 
  UserCheck, 
  ArrowRight,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { StudentProfile, ProjectDNA } from '../types';
import { MOCK_STUDENTS } from '../data/mockStudents';

interface TalentPoolViewProps {
  activeProjectDNA: ProjectDNA;
  activeTeam: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onAddSpecialistToTeam?: (student: StudentProfile) => void;
  onCompareStudent?: (student: StudentProfile) => void;
}

export const TalentPoolView: React.FC<TalentPoolViewProps> = ({
  activeProjectDNA,
  activeTeam,
  onSelectStudent,
  onAddSpecialistToTeam,
  onCompareStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');

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

    const matchesAvailability = 
      availabilityFilter === 'All' ||
      (availabilityFilter === 'High' && student.availability.hoursPerWeek >= 25) ||
      (availabilityFilter === 'Medium' && student.availability.hoursPerWeek < 25);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-[#11182B] border border-[#263550] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Student Talent Pool ({MOCK_STUDENTS.length} Synthetic Profiles)
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Explore verified candidates across AI, Full-Stack, Domain Depth, and Product Management calibrated for <strong>{activeProjectDNA.title}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#94A3B8]">In Active Squad:</span>
          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30">
            {activeTeam.length} Members Assigned
          </span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-[#11182B] border border-[#263550] rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, university, or specific skill (e.g. PyTorch, Next.js, GIS)..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#CBD5E1] focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="All">All Bandwidths</option>
              <option value="High">25+ hrs/wk (Sprint Ready)</option>
              <option value="Medium">&lt; 25 hrs/wk</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-[#38BDF8] text-[#0B1020]'
                  : 'bg-[#17213A] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2942]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const isAssigned = activeTeam.some((m) => m.id === student.id);

          return (
            <div
              key={student.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isAssigned
                  ? 'bg-[#17213A] border-[#38BDF8]/60 shadow-lg shadow-[#38BDF8]/5'
                  : 'bg-[#11182B] border-[#263550] hover:border-[#38BDF8]/40 hover:bg-[#17213A]/50'
              }`}
            >
              <div className="space-y-3">
                
                {/* Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-xl object-cover border border-[#263550]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-[#F8FAFC]">{student.name}</h3>
                        {isAssigned && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                            IN SQUAD
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#38BDF8] font-medium">{student.role}</p>
                      <p className="text-[10px] text-[#94A3B8]">{student.university} ({student.year})</p>
                    </div>
                  </div>
                </div>

                {/* Skills tags with level & interest */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#94A3B8] font-semibold">Core Capabilities:</span>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.slice(0, 3).map((s) => (
                      <span
                        key={s.name}
                        className="px-2 py-0.5 rounded-md bg-[#0B1020] border border-[#263550] text-[10px] text-[#CBD5E1] flex items-center gap-1"
                      >
                        <span>{s.name}</span>
                        <span className="font-mono text-[#38BDF8] font-bold">{s.level}%</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability & Hackathons */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 bg-[#0B1020] border border-[#263550] rounded-lg flex items-center gap-1.5 text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="font-mono text-emerald-400 font-bold">{student.availability.hoursPerWeek}h/wk</span>
                  </div>
                  <div className="p-2 bg-[#0B1020] border border-[#263550] rounded-lg flex items-center gap-1.5 text-[#94A3B8]">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono text-amber-400 font-bold">{student.experience.hackathonsWon} Won</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#263550] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectStudent(student)}
                  className="px-3 py-1.5 rounded-xl bg-[#17213A] hover:bg-[#1D2942] text-[#CBD5E1] text-xs font-semibold border border-[#263550] transition-colors flex-1"
                >
                  Dossier
                </button>

                {!isAssigned && onAddSpecialistToTeam && (
                  <button
                    onClick={() => onAddSpecialistToTeam(student)}
                    className="px-3 py-1.5 rounded-xl bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/40 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Squad</span>
                  </button>
                )}

                {onCompareStudent && (
                  <button
                    onClick={() => onCompareStudent(student)}
                    className="p-1.5 rounded-xl bg-[#17213A] hover:bg-[#1D2942] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263550] transition-colors"
                    title="Compare candidate"
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
