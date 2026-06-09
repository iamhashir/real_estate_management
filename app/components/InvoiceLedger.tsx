'use client';

import { DollarSign, CheckCircle, Clock } from 'lucide-react';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    clientName: 'Sarah Mitchell',
    amount: 5200,
    date: '2024-01-15',
    status: 'paid',
  },
  {
    id: '2',
    clientName: 'James Chen',
    amount: 3800,
    date: '2024-01-14',
    status: 'pending',
  },
  {
    id: '3',
    clientName: 'Emma Rodriguez',
    amount: 7500,
    date: '2024-01-12',
    status: 'paid',
  },
  {
    id: '4',
    clientName: 'Michael Brown',
    amount: 4200,
    date: '2024-01-10',
    status: 'pending',
  },
  {
    id: '5',
    clientName: 'Lisa Wang',
    amount: 6100,
    date: '2024-01-08',
    status: 'paid',
  },
];

export default function InvoiceLedger() {
  const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = mockInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="flex flex-col h-full bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-700 rounded p-3">
            <div className="text-xs text-slate-400">Total</div>
            <div className="text-lg font-bold text-slate-50 mt-1">
              ${(totalAmount / 1000).toFixed(1)}k
            </div>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <div className="text-xs text-slate-400">Paid</div>
            <div className="text-lg font-bold text-green-400 mt-1">
              ${(paidAmount / 1000).toFixed(1)}k
            </div>
          </div>
        </div>
        <div className="bg-slate-700 rounded p-3">
          <div className="text-xs text-slate-400">Pending</div>
          <div className="text-lg font-bold text-yellow-400 mt-1">
            ${(pendingAmount / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {mockInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="px-4 py-3 border-b border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-sm font-medium text-slate-50 truncate">
                {invoice.clientName}
              </span>
              {invoice.status === 'paid' ? (
                <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
              ) : (
                <Clock size={14} className="text-yellow-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{invoice.date}</span>
              <span className="text-sm font-semibold text-slate-50">
                ${invoice.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
          View All Invoices
        </button>
      </div>
    </div>
  );
}
