import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import TrainingStatusBadge from '../components/training/TrainingStatusBadge';
import TrainingProgressBar from '../components/training/TrainingProgressBar';
import TrainingAssignmentModal from '../components/training/TrainingAssignmentModal';
import { useTraining } from '../hooks/useTraining';
import { FiBookOpen, FiUserPlus, FiArrowLeft, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function TrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProgramById, assignments, updateProgress, assignTraining } = useTraining();
  const [showAssignModal, setShowAssignModal] = useState(false);

  const program = getProgramById(id);

  if (!program) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Program Not Found" breadcrumbs={[{ label: 'Training Management', path: '/training' }]} />
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 mb-4">Training program with ID "{id}" was not found.</p>
          <button onClick={() => navigate('/training')} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold">
            Back to Training Catalog
          </button>
        </div>
      </div>
    );
  }

  const programAssignments = assignments.filter((a) => a.trainingId.toLowerCase() === id.toLowerCase());

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Training Overview — ${program.name}`}
        breadcrumbs={[
          { label: 'Training Management', path: '/training' },
          { label: program.id, path: `/training/${program.id}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm"
            >
              <FiUserPlus size={14} /> Assign to Employees
            </button>
            <button onClick={() => navigate('/training')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold">
              <FiArrowLeft size={14} /> Back to Catalog
            </button>
          </div>
        }
      />

      {/* Hero Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0">
            <FiBookOpen size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {program.name}
              <TrainingStatusBadge status={program.status} />
              <TrainingStatusBadge status={program.priority} />
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Code: {program.code} · Category: {program.category} · Duration: {program.duration} · Mode: {program.mode}
            </p>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <Card title="Learning Objectives & Description">
        <div className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{program.description}</p>
          {program.learningObjectives && (
            <div className="space-y-1.5 pt-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Core Competencies:</h4>
              {program.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <FiCheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Assigned Employee Roster */}
      <Card title={`Assigned Employee Roster (${programAssignments.length})`}>
        <div className="space-y-3 text-xs">
          {programAssignments.length === 0 ? (
            <p className="text-slate-400 py-4 text-center">No employees have been assigned to this training yet.</p>
          ) : (
            <div className="space-y-2">
              {programAssignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{a.employeeName}</span>
                    <span className="ml-2 text-slate-400 font-mono">({a.employeeId})</span>
                    <p className="text-[11px] text-slate-400">{a.department} · {a.designation} · Due: {a.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <TrainingProgressBar progress={a.progress} size="sm" />
                    </div>
                    {a.status !== 'Completed' && (
                      <button
                        onClick={() => updateProgress(a.id, 100)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]"
                      >
                        Mark 100%
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modals */}
      <TrainingAssignmentModal
        program={program}
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={assignTraining}
      />
    </div>
  );
}
