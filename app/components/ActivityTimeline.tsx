'use client';

import { Plus, MessageSquare, CheckCircle, FileText, DollarSign, Calendar } from 'lucide-react';

interface ActivityTimelineProps {
  clientId: string;
}

interface Activity {
  id: string;
  type: 'note' | 'invoice' | 'purchase' | 'call';
  title: string;
  description: string;
  date: string;
  amount?: number;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'invoice',
    title: 'Invoice #INV-001',
    description: 'Commission for property match consultation',
    date: '2024-01-15',
    amount: 5200,
  },
  {
    id: '2',
    type: 'purchase',
    title: 'Property Purchase',
    description: '456 Valencia St - Purchase agreement signed',
    date: '2024-01-14',
    amount: 1100000,
  },
  {
    id: '3',
    type: 'call',
    title: 'Phone Call',
    description: 'Discussed property options and timeline',
    date: '2024-01-12',
  },
  {
    id: '4',
    type: 'note',
    title: 'Note',
    description: 'Client prefers open floor plans and natural light',
    date: '2024-01-10',
  },
  {
    id: '5',
    type: 'purchase',
    title: 'Property Offer',
    description: '123 Market St - Made offer of $925k',
    date: '2024-01-08',
    amount: 925000,
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'invoice':
      return <DollarSign size={16} className="text-blue-400" />;
    case 'purchase':
      return <FileText size={16} className="text-green-400" />;
    case 'call':
      return <MessageSquare size={16} className="text-purple-400" />;
    case 'note':
      return <CheckCircle size={16} className="text-slate-400" />;
    default:
      return <Calendar size={16} className="text-slate-400" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'invoice':
      return 'bg-blue-500/10 border-blue-500/20';
    case 'purchase':
      return 'bg-green-500/10 border-green-500/20';
    case 'call':
      return 'bg-purple-500/10 border-purple-500/20';
    default:
      return 'bg-slate-700/50 border-slate-600/50';
  }
};

export default function ActivityTimeline({ clientId }: ActivityTimelineProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 pb-4 border-b border-slate-700">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <Plus size={16} />
          Add Activity
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {mockActivities.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No activities yet</p>
          </div>
        ) : (
          mockActivities.map((activity, idx) => (
            <div
              key={activity.id}
              className={`p-4 border rounded-lg ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-50">
                      {activity.title}
                    </h3>
                    {activity.amount && (
                      <span className="text-sm font-semibold text-slate-50 flex-shrink-0">
                        ${activity.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {idx < mockActivities.length - 1 && (
                <div className="ml-6 mt-4 h-6 border-l border-slate-600" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
