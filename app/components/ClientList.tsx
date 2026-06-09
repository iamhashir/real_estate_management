'use client';

import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Mail } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  lastContact: string;
  status: 'active' | 'pending' | 'closed';
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    phone: '(555) 123-4567',
    interests: ['Downtown Loft', 'Waterfront'],
    lastContact: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'James Chen',
    email: 'james@example.com',
    phone: '(555) 234-5678',
    interests: ['Suburban Home', 'New Construction'],
    lastContact: '1 day ago',
    status: 'active',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma@example.com',
    phone: '(555) 345-6789',
    interests: ['Investment Property'],
    lastContact: '3 days ago',
    status: 'pending',
  },
];

export default function ClientList({ searchQuery }: { searchQuery: string }) {
  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'closed':
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-2">
      {filteredClients.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No clients found</p>
        </div>
      ) : (
        filteredClients.map((client) => (
          <Link
            key={client.id}
            href={`/client/${client.id}`}
            className="block p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-50 truncate">
                    {client.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={14} />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    {client.phone}
                  </div>
                </div>

                {client.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {client.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-2">
                  Last contact: {client.lastContact}
                </p>
              </div>

              <ChevronRight
                size={18}
                className="text-slate-500 group-hover:text-slate-400 flex-shrink-0 mt-1"
              />
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
