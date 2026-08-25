import React, { useState, useEffect } from 'react';
import { ProjectDNA, StudentProfile, ProjectTask, SkillCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  Sparkles,
  Clock,
  AlertTriangle,
  User,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Database,
  Layout,
  Microscope,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { generateProjectTasks } from '../utils/matchingEngine';

interface TaskDecompositionProps {
  projectDNA: ProjectDNA;
  team: StudentProfile[];
  onFindSpecialist?: (skill: string) => void;
}

export const TaskDecomposition: React.FC<TaskDecompositionProps> = ({
  projectDNA,
  team,
  onFindSpecialist,
}) => {
  const [tasks, setTasks] = useState<ProjectTask[]>(() => generateProjectTasks(projectDNA, team));
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('All');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  // New task form state
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<SkillCategory>('AI & ML');
  const [newTaskPriority, setNewTaskPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [newTaskHours, setNewTaskHours] = useState(12);

  // Update tasks when projectDNA or team changes
  useEffect(() => {
    setTasks(generateProjectTasks(projectDNA, team));
  }, [projectDNA, team]);

  const phases = ['All', 'Phase 1: Ingestion & Data', 'Phase 2: Core ML Pipeline', 'Phase 3: Backend & API', 'Phase 4: Frontend & UX', 'Phase 5: Evaluation & Cloud'];

  const filteredTasks = tasks.filter(task => {
    const matchesPhase = selectedPhase === 'All' || task.phase === selectedPhase;
    const matchesAssignee = selectedAssignee === 'All' 
      ? true 
      : selectedAssignee === 'unassigned' 
        ? !task.assignedMemberId 
        : task.assignedMemberId === selectedAssignee;
    return matchesPhase && matchesAssignee;
  });

  const unassignedCount = tasks.filter(t => !t.assignedMemberId || t.isCapabilityGap).length;
  const totalHours = tasks.reduce((acc, t) => acc + t.estimatedHours, 0);

  const handleStatusChange = (taskId: string, newStatus: ProjectTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleAssigneeChange = (taskId: string, memberId: string) => {
    const assignedMember = team.find(m => m.id === memberId);
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          assignedMemberId: assignedMember ? assignedMember.id : undefined,
          assignedMemberName: assignedMember ? assignedMember.name : undefined,
          isCapabilityGap: !assignedMember,
        };
      }
      return t;
    }));
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const createdTask: ProjectTask = {
      id: `task-${Date.now()}`,
      name: newTaskName,
      description: newTaskDesc || 'Custom user-defined project milestone.',
      category: newTaskCategory,
      requiredSkills: [newTaskCategory],
      priority: newTaskPriority,
      estimatedHours: Number(newTaskHours) || 10,
      phase: 'Phase 3: Backend & API',
      status: 'Ready',
      assignedMemberId: team[0]?.id,
      assignedMemberName: team[0]?.name,
      isCapabilityGap: false,
    };

    setTasks(prev => [createdTask, ...prev]);
    setNewTaskName('');
    setNewTaskDesc('');
    setIsAddingTask(false);
  };

  const getPriorityBadge = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'Critical':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">Critical</span>;
      case 'High':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">High Priority</span>;
      case 'Medium':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">Medium</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-500/15 text-neutral-300 border border-neutral-500/30 font-medium">Low</span>;
    }
  };

  const getStatusBadge = (status: ProjectTask['status']) => {
    switch (status) {
      case 'Complete':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>;
      case 'In Progress':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> In Progress</span>;
      case 'Blocked':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Blocked</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-neutral-300 border border-white/10 font-medium">Ready</span>;
    }
  };

  return (
    <div id="task-decomposition-container" className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <CheckSquare className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-semibold text-white tracking-tight">AI Project Task Decomposition</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
              Architectural Pipeline
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Automatically maps technical tasks to best-matched engineers and highlights unassigned capability bottlenecks.
          </p>
        </div>

        {/* Task Metrics & Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3 text-xs">
            <div>
              <div className="text-[10px] text-neutral-400">Total Scope</div>
              <div className="font-bold text-white">{tasks.length} Tasks ({totalHours} hrs)</div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <div className="text-[10px] text-neutral-400">Unassigned Gaps</div>
              <div className={`font-bold ${unassignedCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {unassignedCount} {unassignedCount === 1 ? 'Task' : 'Tasks'}
              </div>
            </div>
          </div>

          <button
            id="btn-add-custom-task"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Modal / Form Tray */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddNewTask}
            className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 backdrop-blur-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Define New Project Task</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 space-y-1">
                <label className="text-[11px] text-neutral-300">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build WebRTC Camera Stream Consumer"
                  value={newTaskName}
                  onChange={e => setNewTaskName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-[11px] text-neutral-300">Pillar Category</label>
                <select
                  value={newTaskCategory}
                  onChange={e => setNewTaskCategory(e.target.value as SkillCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="AI & ML">AI & ML</option>
                  <option value="Frontend & UX">Frontend & UX</option>
                  <option value="Backend & Cloud">Backend & Cloud</option>
                  <option value="Domain & Research">Domain & Research</option>
                  <option value="Security & Systems">Security & Systems</option>
                  <option value="Product & Management">Product & Management</option>
                </select>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-[11px] text-neutral-300">Priority & Hours</label>
                <div className="flex gap-2">
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-1/2 px-2 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <input
                    type="number"
                    min="2"
                    max="60"
                    value={newTaskHours}
                    onChange={e => setNewTaskHours(Number(e.target.value))}
                    className="w-1/2 px-2 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="md:col-span-12 space-y-1">
                <label className="text-[11px] text-neutral-300">Technical Description & Acceptance Criteria</label>
                <textarea
                  rows={2}
                  placeholder="Specify architectural requirements, API contracts, and testing specifications..."
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-colors"
              >
                Insert Task into Sprint
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
        {/* Phase Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-neutral-400 font-medium mr-1 flex items-center gap-1 text-[11px]">
            <Filter className="w-3 h-3" /> Phase:
          </span>
          {phases.map(ph => (
            <button
              key={ph}
              onClick={() => setSelectedPhase(ph)}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium text-[11px] ${
                selectedPhase === ph
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {ph.replace('Phase ', 'P').split(':')[0]}
            </button>
          ))}
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-[11px]">Assignee:</span>
          <select
            value={selectedAssignee}
            onChange={e => setSelectedAssignee(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/10 text-[11px] text-neutral-300 focus:outline-none"
          >
            <option value="All">All Members</option>
            {team.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
            <option value="unassigned">⚠️ Unassigned Gaps</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task, idx) => {
          const assignedMember = team.find(m => m.id === task.assignedMemberId);

          return (
            <motion.div
              key={task.id}
              id={`task-item-${task.id}`}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className={`p-4 rounded-2xl border transition-all ${
                task.isCapabilityGap
                  ? 'bg-amber-500/[0.04] border-amber-500/30'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Side: Task Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-neutral-400">{task.phase.split(':')[0]}</span>
                    {getPriorityBadge(task.priority)}
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-neutral-300 border border-white/5">
                      {task.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" /> {task.estimatedHours}h
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white tracking-tight">
                    {task.name}
                  </h4>

                  <p className="text-xs text-neutral-400 leading-relaxed max-w-3xl">
                    {task.description}
                  </p>

                  {/* Required Skills list */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-neutral-500">Skills required:</span>
                    {task.requiredSkills.map(sk => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] text-neutral-300 border border-white/5 font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side: Assignment & Controls */}
                <div className="flex flex-wrap lg:flex-col items-end gap-2.5 shrink-0">
                  {/* Assigned Member Dropdown */}
                  <div className="flex items-center gap-2">
                    {assignedMember ? (
                      <img
                        src={assignedMember.avatar}
                        alt={assignedMember.name}
                        className="w-7 h-7 rounded-full object-cover border border-cyan-500/30 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <select
                      value={task.assignedMemberId || ''}
                      onChange={e => handleAssigneeChange(task.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="">Unassigned (Capability Gap)</option>
                      {team.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.role.split('&')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                    <select
                      value={task.status}
                      onChange={e => handleStatusChange(task.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] text-neutral-300 focus:outline-none"
                    >
                      <option value="Ready">Mark Ready</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Complete">Complete</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>

                  {/* Gap Action CTA */}
                  {task.isCapabilityGap && onFindSpecialist && (
                    <button
                      id={`btn-fill-gap-${task.id}`}
                      onClick={() => onFindSpecialist(task.requiredSkills[0] || 'DevOps')}
                      className="text-[11px] px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold transition-all flex items-center gap-1"
                    >
                      <span>Find Bench Specialist</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-neutral-500" />
            <p className="text-xs text-neutral-400">No tasks match the active phase and assignee filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
