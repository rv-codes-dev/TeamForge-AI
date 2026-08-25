import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Crown, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Send, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  AlertCircle, 
  ExternalLink,
  Tag,
  Target,
  Zap,
  MessageSquare,
  Filter,
  Check,
  X
} from 'lucide-react';
import { TeamGroup, TeamGroupRequest, TeamGroupMember, UserProfile } from '../types';

interface GroupsViewProps {
  groups: TeamGroup[];
  currentUser: UserProfile | null;
  onSendJoinRequest: (groupId: string, requestData: Omit<TeamGroupRequest, 'id' | 'timestamp' | 'status'>) => void;
  onAcceptRequest: (groupId: string, requestId: string) => void;
  onRejectRequest: (groupId: string, requestId: string, reason?: string) => void;
  onCreateGroup: (newGroup: Omit<TeamGroup, 'id' | 'createdAt' | 'requests' | 'members'>) => void;
  onOpenAuthModal: () => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  currentUser,
  onSendJoinRequest,
  onAcceptRequest,
  onRejectRequest,
  onCreateGroup,
  onOpenAuthModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<TeamGroup | null>(groups[0] || null);
  
  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestTargetGroup, setRequestTargetGroup] = useState<TeamGroup | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [requestNote, setRequestNote] = useState<string>('');
  
  // Create Group Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTagline, setNewGroupTagline] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('AI & Robotics');
  const [newGroupGoal, setNewGroupGoal] = useState('CalHacks 12.0 • Moonshot Prize');
  const [newGroupTechStack, setNewGroupTechStack] = useState('React, Python, FastAPI, Docker');
  const [newGroupRoles, setNewGroupRoles] = useState('Backend Engineer, UI/UX Designer, ML Engineer');
  const [newGroupCapacity, setNewGroupCapacity] = useState(4);

  // Active Lead view toggle or filter
  const [viewFilter, setViewFilter] = useState<'all' | 'my-leads' | 'my-requests'>('all');

  const categories = ['All', 'AI & Robotics', 'Agentic AI & GenAI', 'BioTech & Health AI', 'Web3 & Cryptography'];

  const filteredGroups = groups.filter(g => {
    const matchesCat = selectedCategory === 'All' || g.projectCategory.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery = searchQuery === '' || 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.requiredTechStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (viewFilter === 'my-leads') {
      const isLead = currentUser && (
        g.leadEmail.toLowerCase() === currentUser.email.toLowerCase() ||
        g.leadId === currentUser.id
      );
      return matchesCat && matchesQuery && isLead;
    }

    if (viewFilter === 'my-requests') {
      const hasApplied = currentUser && g.requests.some(r => r.userEmail.toLowerCase() === currentUser.email.toLowerCase());
      return matchesCat && matchesQuery && hasApplied;
    }

    return matchesCat && matchesQuery;
  });

  const handleOpenRequest = (group: TeamGroup) => {
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    setRequestTargetGroup(group);
    setSelectedRole(group.lookingForRoles[0] || 'Full Stack Developer');
    setRequestNote(`Hi ${group.leadName}! I have experience with ${currentUser.skills.slice(0, 2).map(s => s.name).join(', ')} and would love to contribute to ${group.name}.`);
    setIsRequestModalOpen(true);
  };

  const handleConfirmSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTargetGroup || !currentUser) return;

    onSendJoinRequest(requestTargetGroup.id, {
      groupId: requestTargetGroup.id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      userRole: currentUser.preferredRoles?.[0] || 'Software Engineer',
      userUniversity: currentUser.university || 'University Student',
      matchScore: 92,
      skills: currentUser.skills.map(s => s.name),
      requestedRole: selectedRole,
      message: requestNote.trim() || 'Ready to contribute actively to this team!',
    });

    setIsRequestModalOpen(false);
  };

  const handleConfirmCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (!newGroupName.trim()) return;

    onCreateGroup({
      name: newGroupName.trim(),
      tagline: newGroupTagline.trim() || 'High-impact project squad seeking talented collaborators.',
      description: newGroupDesc.trim() || 'Building an innovative solution for upcoming hackathon judging.',
      projectCategory: newGroupCategory,
      targetHackathonOrGoal: newGroupGoal.trim() || 'Hackathon Championship',
      leadId: currentUser.id,
      leadName: currentUser.fullName,
      leadEmail: currentUser.email,
      leadAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      leadRole: currentUser.preferredRoles?.[0] || 'Team Lead & Architect',
      maxMembers: newGroupCapacity,
      lookingForRoles: newGroupRoles.split(',').map(r => r.trim()).filter(Boolean),
      requiredTechStack: newGroupTechStack.split(',').map(t => t.trim()).filter(Boolean),
      status: 'recruiting',
      bannerGradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    });

    setIsCreateModalOpen(false);
    setNewGroupName('');
    setNewGroupTagline('');
    setNewGroupDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Actions Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#17213A] via-[#11182B] to-[#17213A] border border-[#263550] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D2942] border border-[#38BDF8]/30 text-xs font-semibold text-[#38BDF8]">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Squad Match & Team Lead Desk</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Open Teams, Squads & Join Requests
            </h1>
            <p className="text-xs md:text-sm text-[#CBD5E1] leading-relaxed">
              Explore active project teams recruiting specialists. Send a direct join request to the <strong className="text-[#38BDF8]">Team Head</strong>, or create your own squad and accept/reject applicants with 1-click controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (!currentUser) onOpenAuthModal();
                else setIsCreateModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] text-[#0B1020] font-bold text-xs flex items-center gap-2 hover:opacity-95 shadow-lg shadow-[#38BDF8]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Squad</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Strip */}
        <div className="mt-6 pt-5 border-t border-[#263550] flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams, tech stacks, or domains..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                viewFilter === 'all'
                  ? 'bg-[#38BDF8] text-[#0B1020]'
                  : 'bg-[#0B1020] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263550]'
              }`}
            >
              All Open Teams ({groups.length})
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => setViewFilter('my-leads')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 ${
                    viewFilter === 'my-leads'
                      ? 'bg-amber-400 text-[#0B1020]'
                      : 'bg-[#0B1020] text-[#94A3B8] hover:text-amber-300 border border-[#263550]'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Teams I Lead</span>
                </button>

                <button
                  onClick={() => setViewFilter('my-requests')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 ${
                    viewFilter === 'my-requests'
                      ? 'bg-[#8B5CF6] text-white'
                      : 'bg-[#0B1020] text-[#94A3B8] hover:text-purple-300 border border-[#263550]'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>My Sent Requests</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid: Groups Cards list & Detail/Lead Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Team Cards List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Available Project Squads ({filteredGroups.length})</span>
            </h2>
            <span className="text-[11px] text-[#64748B]">Click any team to inspect details & lead desk</span>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center bg-[#11182B] border border-[#263550] rounded-2xl space-y-3">
              <AlertCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <div className="text-sm font-bold text-[#F8FAFC]">No squads match your filters</div>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Try searching for another technology or switch filters to browse all open hackathon squads.
              </p>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isSelected = selectedGroup?.id === group.id;
              const isLead = currentUser && (
                group.leadEmail.toLowerCase() === currentUser.email.toLowerCase() ||
                group.leadId === currentUser.id
              );
              const pendingRequestsCount = group.requests.filter(r => r.status === 'pending').length;
              const myRequest = currentUser ? group.requests.find(r => r.userEmail.toLowerCase() === currentUser.email.toLowerCase()) : null;
              const isMember = currentUser ? group.members.some(m => m.email?.toLowerCase() === currentUser.email.toLowerCase()) : false;

              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#17213A] border-[#38BDF8] shadow-lg shadow-[#38BDF8]/10'
                      : 'bg-[#11182B] border-[#263550] hover:border-[#38BDF8]/50 hover:bg-[#17213A]/60'
                  }`}
                >
                  {/* Top Bar of the Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1D2942] border border-[#263550] text-[#38BDF8]">
                          {group.projectCategory}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {group.members.length}/{group.maxMembers} Members
                        </span>
                        {isLead && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span>You are Team Head</span>
                          </span>
                        )}
                        {isMember && !isLead && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-300">
                            ✓ Squad Member
                          </span>
                        )}
                        {myRequest && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            myRequest.status === 'pending'
                              ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                              : myRequest.status === 'accepted'
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                          }`}>
                            Request: {myRequest.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#F8FAFC]">{group.name}</h3>
                      <p className="text-xs text-[#94A3B8] line-clamp-2">{group.tagline}</p>
                    </div>

                    {/* Team Lead Avatar Pill */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0B1020] border border-[#263550] shrink-0 text-right">
                      <div className="hidden sm:block">
                        <div className="text-[11px] font-bold text-[#F8FAFC] truncate">{group.leadName}</div>
                        <div className="text-[9px] text-amber-400 flex items-center justify-end gap-0.5">
                          <Crown className="w-2.5 h-2.5" />
                          <span>Team Head</span>
                        </div>
                      </div>
                      <img
                        src={group.leadAvatar}
                        alt={group.leadName}
                        className="w-8 h-8 rounded-lg object-cover border border-amber-400/40"
                      />
                    </div>
                  </div>

                  {/* Required Tech Stack */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {group.requiredTechStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#0B1020] border border-[#263550] text-[10px] text-[#CBD5E1] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Looking for Roles Strip & Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-[#263550] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-[11px] text-[#94A3B8]">
                      <strong className="text-[#CBD5E1]">Open Roles: </strong>
                      {group.lookingForRoles.join(' • ')}
                    </div>

                    <div className="flex items-center gap-2">
                      {isLead ? (
                        <div className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                          <span>{pendingRequestsCount} Pending Review</span>
                        </div>
                      ) : isMember ? (
                        <span className="text-xs text-emerald-400 font-semibold">Active Member</span>
                      ) : myRequest?.status === 'pending' ? (
                        <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Approval</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRequest(group);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#38BDF8]/15 hover:bg-[#38BDF8] text-[#38BDF8] hover:text-[#0B1020] border border-[#38BDF8]/40 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Group Deep-Dive & Team Lead Management Deck (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {selectedGroup ? (
            <div className="p-6 rounded-3xl bg-[#11182B] border border-[#263550] shadow-xl space-y-6 sticky top-20">
              
              {/* Header */}
              <div className="space-y-2 pb-4 border-b border-[#263550]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#17213A] border border-[#38BDF8]/30 text-[#38BDF8]">
                    {selectedGroup.targetHackathonOrGoal}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {selectedGroup.members.length} of {selectedGroup.maxMembers} slots filled
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">{selectedGroup.name}</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">{selectedGroup.description}</p>
              </div>

              {/* Team Lead Profile Section */}
              <div className="p-4 rounded-2xl bg-[#17213A]/70 border border-[#263550] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="font-bold flex items-center gap-1 text-amber-400">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Team Lead (Squad Head)</span>
                  </span>
                  <span className="text-[10px] text-[#64748B]">Decides team admission</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={selectedGroup.leadAvatar}
                    alt={selectedGroup.leadName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400/60 shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#F8FAFC]">{selectedGroup.leadName}</div>
                    <div className="text-xs text-[#38BDF8]">{selectedGroup.leadRole}</div>
                    <div className="text-[11px] text-[#94A3B8] font-mono truncate">{selectedGroup.leadEmail}</div>
                  </div>
                </div>
              </div>

              {/* Squad Members Roster */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F8FAFC]">Squad Roster ({selectedGroup.members.length})</span>
                  <span className="text-[10px] text-[#94A3B8]">{selectedGroup.maxMembers - selectedGroup.members.length} slots open</span>
                </div>

                <div className="space-y-2">
                  {selectedGroup.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-2.5 rounded-xl bg-[#0B1020] border border-[#263550] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-lg object-cover border border-[#263550]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                            <span>{member.name}</span>
                            {member.isLead && (
                              <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-[#38BDF8]">{member.role}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">
                        {member.joinedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TEAM LEAD CONTROL DESK (Incoming Join Requests) */}
              {(() => {
                const isLead = currentUser && (
                  selectedGroup.leadEmail.toLowerCase() === currentUser.email.toLowerCase() ||
                  selectedGroup.leadId === currentUser.id
                );
                const pendingReqs = selectedGroup.requests.filter(r => r.status === 'pending');

                if (isLead) {
                  return (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <h4 className="text-xs font-bold text-amber-300">
                            Team Lead Control Desk
                          </h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold">
                          {pendingReqs.length} Incoming Requests
                        </span>
                      </div>
                      <p className="text-[11px] text-[#CBD5E1]">
                        As the head of <strong className="text-white">{selectedGroup.name}</strong>, only you have authority to accept or reject incoming join requests.
                      </p>

                      {pendingReqs.length === 0 ? (
                        <div className="p-3 text-center rounded-xl bg-[#0B1020]/60 border border-[#263550] text-xs text-[#94A3B8]">
                          No pending join requests right now.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pendingReqs.map((req) => (
                            <div
                              key={req.id}
                              className="p-3.5 rounded-xl bg-[#0B1020] border border-[#263550] space-y-2.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={req.userAvatar}
                                    alt={req.userName}
                                    className="w-9 h-9 rounded-lg object-cover border border-[#38BDF8]/40"
                                  />
                                  <div>
                                    <div className="text-xs font-bold text-[#F8FAFC]">{req.userName}</div>
                                    <div className="text-[10px] text-[#38BDF8]">
                                      Applying for: <strong className="text-white">{req.requestedRole}</strong>
                                    </div>
                                    <div className="text-[9px] text-[#94A3B8]">{req.userUniversity}</div>
                                  </div>
                                </div>

                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                  {req.matchScore}% Synergy
                                </span>
                              </div>

                              {/* Message from applicant */}
                              <div className="p-2 rounded-lg bg-[#17213A] border border-[#263550] text-[11px] text-[#CBD5E1] italic">
                                "{req.message}"
                              </div>

                              {/* Skills chips */}
                              <div className="flex flex-wrap gap-1">
                                {req.skills.slice(0, 4).map((sk, i) => (
                                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#11182B] text-[#94A3B8] border border-[#263550]">
                                    {sk}
                                  </span>
                                ))}
                              </div>

                              {/* Accept / Reject Buttons for Team Lead */}
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => onAcceptRequest(selectedGroup.id, req.id)}
                                  className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[#0B1020] font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept to Squad</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRejectRequest(selectedGroup.id, req.id)}
                                  className="py-1.5 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Decline</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // If user is not lead, show applicant action button
                const myReq = currentUser ? selectedGroup.requests.find(r => r.userEmail.toLowerCase() === currentUser.email.toLowerCase()) : null;
                const isMember = currentUser ? selectedGroup.members.some(m => m.email?.toLowerCase() === currentUser.email.toLowerCase()) : false;

                if (isMember) {
                  return (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <strong>You are on this team!</strong> You can coordinate on project tasks and sync in Member Hub.
                      </div>
                    </div>
                  );
                }

                if (myReq) {
                  return (
                    <div className={`p-4 rounded-2xl border space-y-2 ${
                      myReq.status === 'pending'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                        : myReq.status === 'accepted'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Your Join Request Status:</span>
                        <span className="uppercase">{myReq.status}</span>
                      </div>
                      <p className="text-[11px] text-[#CBD5E1]">
                        {myReq.status === 'pending' && `Your request has been sent to ${selectedGroup.leadName}. You will be notified when they accept or reject.`}
                        {myReq.status === 'accepted' && `Congratulations! ${selectedGroup.leadName} accepted you into the squad.`}
                        {myReq.status === 'rejected' && `Your application was not selected for this cohort.`}
                      </p>
                    </div>
                  );
                }

                return (
                  <button
                    type="button"
                    onClick={() => handleOpenRequest(selectedGroup)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] text-[#0B1020] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#38BDF8]/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Join Request to {selectedGroup.leadName}</span>
                  </button>
                );
              })()}

            </div>
          ) : (
            <div className="p-8 text-center bg-[#11182B] border border-[#263550] rounded-3xl text-xs text-[#94A3B8]">
              Select a squad on the left to view members, requirements, and lead approvals.
            </div>
          )}
        </div>

      </div>

      {/* JOIN REQUEST MODAL */}
      {isRequestModalOpen && requestTargetGroup && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#11182B] border border-[#263550] rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#263550]">
              <div>
                <div className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                  Request to Join Squad
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  {requestTargetGroup.name}
                </h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17213A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Notice */}
            <div className="p-3.5 rounded-2xl bg-[#17213A]/60 border border-[#263550] flex items-center gap-3">
              <img
                src={requestTargetGroup.leadAvatar}
                alt={requestTargetGroup.leadName}
                className="w-10 h-10 rounded-xl object-cover border border-amber-400/40"
              />
              <div className="text-xs">
                <div className="font-bold text-[#F8FAFC]">
                  Target Recipient: {requestTargetGroup.leadName} <span className="text-amber-400 font-normal">(Team Head)</span>
                </div>
                <div className="text-[11px] text-[#94A3B8]">
                  Only {requestTargetGroup.leadName} can review and accept your squad application.
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmSendRequest} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">
                  Select the Role You are Applying For:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                >
                  {requestTargetGroup.lookingForRoles.map((role, i) => (
                    <option key={i} value={role}>{role}</option>
                  ))}
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                </select>
              </div>

              {/* Pitch Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">
                  Personal Pitch Note to {requestTargetGroup.leadName}:
                </label>
                <textarea
                  rows={3}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Explain why you're a strong fit, relevant projects, and weekly hours..."
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              {/* Applicant Preview Badges */}
              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#263550] space-y-1 text-xs">
                <div className="text-[11px] text-[#94A3B8]">Applying As:</div>
                <div className="font-bold text-[#F8FAFC]">{currentUser.fullName} ({currentUser.university})</div>
                <div className="text-[10px] text-[#38BDF8] truncate">
                  Skills: {currentUser.skills.map(s => s.name).join(', ')}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#22D3EE] text-[#0B1020] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#38BDF8]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Join Request</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CREATE SQUAD MODAL */}
      {isCreateModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#11182B] border border-[#263550] rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#263550]">
              <div>
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>You will be the Team Head</span>
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  Create New Project Squad
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17213A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCreateGroup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">Squad Name *</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. BioSynthetica AI Labs"
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">Short Tagline</label>
                <input
                  type="text"
                  value={newGroupTagline}
                  onChange={(e) => setNewGroupTagline(e.target.value)}
                  placeholder="e.g. Next-gen CRISPR sequence generator for oncology"
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">Detailed Description</label>
                <textarea
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="What is your squad building and what problem does it solve?"
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1]">Category</label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="AI & Robotics">AI & Robotics</option>
                    <option value="Agentic AI & GenAI">Agentic AI & GenAI</option>
                    <option value="BioTech & Health AI">BioTech & Health AI</option>
                    <option value="Web3 & Cryptography">Web3 & Cryptography</option>
                    <option value="FinTech & Security">FinTech & Security</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1]">Team Capacity</label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={newGroupCapacity}
                    onChange={(e) => setNewGroupCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">Target Hackathon or Goal</label>
                <input
                  type="text"
                  value={newGroupGoal}
                  onChange={(e) => setNewGroupGoal(e.target.value)}
                  placeholder="e.g. CalHacks 12.0 • AI Track"
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">Required Tech Stacks (Comma separated)</label>
                <input
                  type="text"
                  value={newGroupTechStack}
                  onChange={(e) => setNewGroupTechStack(e.target.value)}
                  placeholder="e.g. PyTorch, React, FastAPI, Docker"
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">Roles You Are Looking For (Comma separated)</label>
                <input
                  type="text"
                  value={newGroupRoles}
                  onChange={(e) => setNewGroupRoles(e.target.value)}
                  placeholder="e.g. Backend Lead, UI/UX Designer, ML Specialist"
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263550]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-[#0B1020] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Launch Squad as Team Head</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
