'use client';

import { useState } from 'react';
import { Plus, MapPin, DollarSign, Maximize2, Heart } from 'lucide-react';

interface PropertyMatcher {
  clientId: string;
}

interface Property {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  matchScore: number;
  liked: boolean;
}

const mockProperties: Property[] = [
  {
    id: '1',
    address: '123 Market St, San Francisco, CA',
    price: 950000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    matchScore: 92,
    liked: true,
  },
  {
    id: '2',
    address: '456 Valencia St, San Francisco, CA',
    price: 1100000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    matchScore: 85,
    liked: false,
  },
  {
    id: '3',
    address: '789 Mission St, San Francisco, CA',
    price: 875000,
    beds: 2,
    baths: 2,
    sqft: 1600,
    matchScore: 78,
    liked: false,
  },
];

export default function PropertyMatcher({ clientId }: PropertyMatcher) {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [filter, setFilter] = useState<'all' | 'liked'>('all');

  const filteredProperties =
    filter === 'liked'
      ? properties.filter((p) => p.liked)
      : properties;

  const toggleLike = (id: string) => {
    setProperties(
      properties.map((p) =>
        p.id === id ? { ...p, liked: !p.liked } : p
      )
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    return 'text-yellow-400';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          All Properties
        </button>
        <button
          onClick={() => setFilter('liked')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            filter === 'liked'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Liked ({properties.filter((p) => p.liked).length})
        </button>
        <button className="ml-auto flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-50 text-sm rounded transition-colors">
          <Plus size={14} />
          Match
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No properties found</p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <div
              key={property.id}
              className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-50 mb-1 truncate">
                    {property.address}
                  </h3>
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-50">
                      ${(property.price / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getMatchColor(property.matchScore)}`}>
                    {property.matchScore}%
                  </div>
                  <div className="text-xs text-slate-400">match</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-slate-700 rounded p-2 text-center">
                  <div className="text-xs text-slate-400">Beds</div>
                  <div className="font-semibold text-slate-50">{property.beds}</div>
                </div>
                <div className="bg-slate-700 rounded p-2 text-center">
                  <div className="text-xs text-slate-400">Baths</div>
                  <div className="font-semibold text-slate-50">
                    {property.baths}
                  </div>
                </div>
                <div className="bg-slate-700 rounded p-2 text-center">
                  <div className="text-xs text-slate-400">SqFt</div>
                  <div className="font-semibold text-slate-50 text-sm">
                    {(property.sqft / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-50 text-sm rounded transition-colors">
                  View Details
                </button>
                <button
                  onClick={() => toggleLike(property.id)}
                  className={`px-3 py-2 rounded transition-colors ${
                    property.liked
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-50'
                  }`}
                >
                  <Heart size={16} fill={property.liked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
