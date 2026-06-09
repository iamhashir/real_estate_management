import type { Metadata } from "next";
import { Search, Plus, MapPin, DollarSign, Home, Bed, Bath } from "lucide-react";

export const metadata: Metadata = { title: "Properties" };

const properties = [
  {
    id: 1,
    address: "123 Market St, San Francisco, CA",
    price: 950000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    status: "available",
    daysOnMarket: 12,
  },
  {
    id: 2,
    address: "456 Valencia St, San Francisco, CA",
    price: 1100000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: "under-contract",
    daysOnMarket: 8,
  },
  {
    id: 3,
    address: "789 Mission St, San Francisco, CA",
    price: 875000,
    beds: 2,
    baths: 2,
    sqft: 1600,
    status: "available",
    daysOnMarket: 25,
  },
  {
    id: 4,
    address: "321 Castro St, San Francisco, CA",
    price: 1250000,
    beds: 4,
    baths: 3,
    sqft: 3200,
    status: "pending-inspection",
    daysOnMarket: 5,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-success/10 text-success";
    case "under-contract":
      return "bg-info/10 text-info";
    case "pending-inspection":
      return "bg-warning/10 text-warning";
    case "sold":
      return "bg-danger/10 text-danger";
    default:
      return "bg-ink-200 text-ink-600";
  }
};

const getStatusLabel = (status: string) => {
  return status.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-ink-900">Properties</h1>
          <p className="text-ink-600 mt-1">
            Manage all properties in your portfolio.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-tide text-white rounded-radius-md font-medium hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400"
          />
          <input
            type="text"
            placeholder="Search by address or ZIP code..."
            className="w-full pl-9 pr-4 py-2 bg-surface-card border border-hairline rounded-radius-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-aqua-500"
          />
        </div>
        <select className="px-3 py-2 bg-surface-card border border-hairline rounded-radius-sm text-ink-900 focus:outline-none focus:border-aqua-500">
          <option>All Status</option>
          <option>Available</option>
          <option>Under Contract</option>
          <option>Sold</option>
        </select>
      </div>

      {/* Properties grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-surface-card rounded-radius-md border border-hairline shadow-card hover:shadow-float transition-shadow p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  <MapPin size={18} className="text-sea-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-h3 text-ink-900 truncate">
                      {property.address}
                    </h3>
                    <p className="text-sm text-ink-600 mt-1">
                      {property.daysOnMarket} days on market
                    </p>
                  </div>
                </div>
              </div>
              <span
                className={`text-label px-2.5 py-1 rounded-full flex-shrink-0 ${getStatusColor(property.status)}`}
              >
                {getStatusLabel(property.status)}
              </span>
            </div>

            <div className="bg-surface-base rounded-radius-sm p-4 mb-4 border border-hairline">
              <div className="flex items-baseline gap-2 mb-3">
                <DollarSign size={18} className="text-aqua-500" />
                <span className="text-display-xl text-aqua-500 font-bold text-money">
                  {(property.price / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bed size={16} className="text-ink-600" />
                    <span className="font-medium text-ink-900">
                      {property.beds}
                    </span>
                  </div>
                  <p className="text-xs text-ink-600">Beds</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bath size={16} className="text-ink-600" />
                    <span className="font-medium text-ink-900">
                      {property.baths}
                    </span>
                  </div>
                  <p className="text-xs text-ink-600">Baths</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Home size={16} className="text-ink-600" />
                    <span className="font-medium text-ink-900">
                      {(property.sqft / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <p className="text-xs text-ink-600">SqFt</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-aqua-500 text-white rounded-radius-sm font-medium hover:bg-aqua-600 transition-colors text-sm">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 bg-surface-base border border-hairline text-ink-900 rounded-radius-sm font-medium hover:border-aqua-300 transition-colors text-sm">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
