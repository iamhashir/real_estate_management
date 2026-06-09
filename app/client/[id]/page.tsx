'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import ClientMetadata from '@/app/components/ClientMetadata';
import PropertyMatcher from '@/app/components/PropertyMatcher';
import ActivityTimeline from '@/app/components/ActivityTimeline';

export default function ClientDetail({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const [activeTab, setActiveTab] = useState<'properties' | 'activity'>('properties');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      <header className="border-b border-slate-700 bg-slate-900 px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4 w-fit"
        >
          <ChevronLeft size={18} />
          Back to Pipeline
        </Link>
        <h1 className="text-2xl font-bold text-slate-50">Client Control Center</h1>
      </header>

      <div className="flex-1 overflow-hidden flex gap-6 p-6">
        <div className="w-80 flex flex-col gap-6 min-w-0">
          <ClientMetadata clientId={clientId} />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex gap-2 mb-4 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === 'properties'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              Property Matches
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === 'activity'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              Activity & Ledger
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'properties' ? (
              <PropertyMatcher clientId={clientId} />
            ) : (
              <ActivityTimeline clientId={clientId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
