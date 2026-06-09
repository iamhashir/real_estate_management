import type { Metadata } from "next";
import { Search, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Clients" };

const clients = [
  {
    id: 1,
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    phone: "(555) 123-4567",
    status: "active",
    budget: "$800k - $1.2M",
    interests: 3,
  },
  {
    id: 2,
    name: "James Chen",
    email: "james@example.com",
    phone: "(555) 234-5678",
    status: "active",
    budget: "$600k - $900k",
    interests: 2,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma@example.com",
    phone: "(555) 345-6789",
    status: "pending",
    budget: "$1.2M - $1.8M",
    interests: 1,
  },
  {
    id: 4,
    name: "Patricia Moore",
    email: "patricia@example.com",
    phone: "(555) 456-7890",
    status: "active",
    budget: "$450k - $700k",
    interests: 4,
  },
];

export default function ClientsPage() {
  return (
    <div className="flex h-full gap-0 -m-4 md:-m-6">
      {/* Left panel — client list */}
      <div
        className="
          w-full lg:w-[380px] lg:shrink-0
          border-r border-hairline
          bg-surface-card overflow-y-auto
          flex flex-col
        "
      >
        {/* Search + filter bar */}
        <div className="p-4 border-b border-hairline flex-shrink-0">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400"
              />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full pl-9 pr-3 py-2 bg-surface-base border border-hairline rounded-radius-sm text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-aqua-500"
              />
            </div>
            <button className="p-2 bg-aqua-500 text-white rounded-radius-sm hover:bg-aqua-600 transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Client list */}
        <div className="flex-1 overflow-y-auto divide-y divide-hairline">
          {clients.map((client) => (
            <button
              key={client.id}
              className="w-full text-left px-4 py-3 hover:bg-aqua-100/30 transition-colors flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-full bg-gradient-tide flex items-center justify-center flex-shrink-0 text-white font-medium text-sm"
              >
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink-900 text-sm truncate">
                  {client.name}
                </p>
                <p className="text-xs text-ink-600 truncate">{client.email}</p>
                <div className="flex justify-between items-center mt-1">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      client.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {client.status}
                  </span>
                  <span className="text-xs text-aqua-600 font-medium">
                    {client.interests} match
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel — client profile (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto p-8 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-h1 text-ink-900">Sarah Mitchell</h1>
                <p className="text-ink-600 mt-2">
                  San Francisco, CA • First-time buyer
                </p>
              </div>
              <span className="px-3 py-1 bg-success/10 text-success text-label rounded-full">
                active
              </span>
            </div>
          </div>

          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-card rounded-radius-md p-4 border border-hairline">
              <p className="text-label text-ink-600 mb-2">Budget</p>
              <p className="text-h3 text-ink-900">$800k - $1.2M</p>
            </div>
            <div className="bg-surface-card rounded-radius-md p-4 border border-hairline">
              <p className="text-label text-ink-600 mb-2">Timeline</p>
              <p className="text-h3 text-ink-900">3-6 months</p>
            </div>
          </div>

          {/* Contact details */}
          <div className="bg-surface-card rounded-radius-md p-6 border border-hairline">
            <h3 className="text-h3 text-ink-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-label text-ink-600">Email</p>
                <p className="text-ink-900">sarah@example.com</p>
              </div>
              <div>
                <p className="text-label text-ink-600">Phone</p>
                <p className="text-ink-900">(555) 123-4567</p>
              </div>
            </div>
          </div>

          {/* Property interests */}
          <div className="bg-surface-card rounded-radius-md p-6 border border-hairline">
            <h3 className="text-h3 text-ink-900 mb-4">Property Interests</h3>
            <div className="flex flex-wrap gap-2">
              {["Downtown Loft", "Waterfront Views", "Modern Design"].map(
                (interest) => (
                  <span
                    key={interest}
                    className="px-3 py-2 bg-aqua-100 text-aqua-700 text-sm rounded-radius-sm font-medium"
                  >
                    {interest}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-surface-card rounded-radius-md p-6 border border-hairline">
            <h3 className="text-h3 text-ink-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-aqua-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-ink-900">
                    Matched to 3 properties
                  </p>
                  <p className="text-xs text-ink-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-ink-900">
                    Joined CRM
                  </p>
                  <p className="text-xs text-ink-600">Jan 15, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
