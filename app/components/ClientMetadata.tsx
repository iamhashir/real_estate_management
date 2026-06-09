'use client';

import { Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';

interface ClientMetadataProps {
  clientId: string;
}

const mockClientData = {
  '1': {
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    phone: '(555) 123-4567',
    address: 'San Francisco, CA',
    status: 'active',
    budget: '$800k - $1.2M',
    timeline: '3-6 months',
    joinedDate: 'Jan 15, 2024',
    notes: 'Prefers modern designs with open floor plans. Looking for investment opportunities.',
  },
  '2': {
    name: 'James Chen',
    email: 'james@example.com',
    phone: '(555) 234-5678',
    address: 'Oakland, CA',
    status: 'active',
    budget: '$600k - $900k',
    timeline: '1-2 months',
    joinedDate: 'Jan 10, 2024',
    notes: 'First-time buyer. Very responsive and detail-oriented.',
  },
  '3': {
    name: 'Emma Rodriguez',
    email: 'emma@example.com',
    phone: '(555) 345-6789',
    address: 'Berkeley, CA',
    status: 'pending',
    budget: '$1.2M - $1.8M',
    timeline: '6-12 months',
    joinedDate: 'Jan 05, 2024',
    notes: 'Executive buyer. Focused on waterfront properties.',
  },
};

export default function ClientMetadata({ clientId }: ClientMetadataProps) {
  const client =
    mockClientData[clientId as keyof typeof mockClientData] || mockClientData['1'];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-50">{client.name}</h2>
            <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded">
              {client.status}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-700 rounded transition-colors">
              <Edit2 size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-700 rounded transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Contact
          </div>
          <div className="space-y-2">
            <a
              href={`mailto:${client.email}`}
              className="flex items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors"
            >
              <Mail size={16} />
              {client.email}
            </a>
            <a
              href={`tel:${client.phone}`}
              className="flex items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors"
            >
              <Phone size={16} />
              {client.phone}
            </a>
            <div className="flex items-center gap-3 text-slate-400">
              <MapPin size={16} />
              {client.address}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Purchase Details
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 rounded p-3">
              <div className="text-xs text-slate-400 mb-1">Budget</div>
              <div className="font-semibold text-slate-50 text-sm">
                {client.budget}
              </div>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <div className="text-xs text-slate-400 mb-1">Timeline</div>
              <div className="font-semibold text-slate-50 text-sm">
                {client.timeline}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Relationship
          </div>
          <div className="bg-slate-700 rounded p-3">
            <div className="text-xs text-slate-400 mb-1">Joined</div>
            <div className="font-semibold text-slate-50 text-sm">
              {client.joinedDate}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Notes
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {client.notes}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900 space-y-2">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
          Log Activity
        </button>
        <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-50 text-sm font-medium rounded transition-colors">
          Create Invoice
        </button>
      </div>
    </div>
  );
}
