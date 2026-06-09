'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ClientList from './components/ClientList';
import InvoiceLedger from './components/InvoiceLedger';
import QuickAddModal from './components/QuickAddModal';

export default function Home() {
  const [showAddClient, setShowAddClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      <header className="border-b border-slate-700 bg-slate-900 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-50">Pipeline & Ledger</h1>
          <button
            onClick={() => setShowAddClient(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            Add Client
          </button>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search clients by name, email, or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex gap-6 p-6">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Active Clients
          </div>
          <ClientList searchQuery={searchQuery} />
        </div>

        <div className="w-96 flex flex-col min-w-0">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Recent Invoices
          </div>
          <InvoiceLedger />
        </div>
      </div>

      <QuickAddModal isOpen={showAddClient} onClose={() => setShowAddClient(false)} />
    </div>
  );
}
