import type { Metadata } from "next";
import { TrendingUp, Users, Home, DollarSign } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

const stats = [
  {
    label: "Active Deals",
    value: "12",
    change: "+3 this month",
    icon: TrendingUp,
    color: "aqua",
  },
  {
    label: "Total Clients",
    value: "48",
    change: "+5 new",
    icon: Users,
    color: "success",
  },
  {
    label: "Properties Listed",
    value: "34",
    change: "8 pending",
    icon: Home,
    color: "info",
  },
  {
    label: "Revenue (YTD)",
    value: "$285K",
    change: "+18% vs last year",
    icon: DollarSign,
    color: "coral",
  },
];

const pipeline = [
  {
    stage: "Prospecting",
    count: 8,
    deals: ["Sarah Mitchell", "James Chen", "Michael Brown", "Lisa Wang"],
  },
  {
    stage: "Under Contract",
    count: 3,
    deals: ["Emma Rodriguez", "David Lee"],
  },
  {
    stage: "In Inspection",
    count: 2,
    deals: ["Patricia Moore", "Robert Garcia"],
  },
  {
    stage: "Closing",
    count: 1,
    deals: ["Jennifer White"],
  },
];

const recentActivity = [
  {
    time: "2 hours ago",
    action: "Sarah Mitchell",
    detail: "Matched to 3 new properties",
    type: "match",
  },
  {
    time: "4 hours ago",
    action: "James Chen",
    detail: "Offer accepted on Valencia St property",
    type: "deal",
  },
  {
    time: "Today",
    action: "Invoice #INV-001",
    detail: "Payment received from Sarah Mitchell",
    type: "payment",
  },
  {
    time: "Yesterday",
    action: "New Client",
    detail: "Patricia Moore joined from referral",
    type: "client",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-ink-900">Dashboard</h1>
        <p className="text-ink-600 mt-1">
          Pipeline overview, key metrics, and recent activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-surface-card rounded-radius-md shadow-card p-4 border border-hairline"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-2 rounded-full ${
                    stat.color === "aqua"
                      ? "bg-aqua-100"
                      : stat.color === "success"
                        ? "bg-emerald-100"
                        : stat.color === "info"
                          ? "bg-blue-100"
                          : "bg-coral-100"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      stat.color === "aqua"
                        ? "text-aqua-500"
                        : stat.color === "success"
                          ? "text-success"
                          : stat.color === "info"
                            ? "text-info"
                            : "text-coral-500"
                    }
                  />
                </div>
              </div>
              <div>
                <p className="text-ink-400 text-label">{stat.label}</p>
                <p className="text-3xl font-bold text-ink-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-ink-600 mt-2">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pipeline stages */}
        <div className="lg:col-span-2">
          <div className="bg-surface-card rounded-radius-md shadow-card p-6 border border-hairline">
            <h2 className="text-h3 text-ink-900 mb-6">Deal Pipeline</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pipeline.map((stage) => (
                <div
                  key={stage.stage}
                  className="bg-gradient-to-br from-aqua-100 to-aqua-50 rounded-radius-md p-4 border border-aqua-300"
                >
                  <p className="text-label text-ink-600 mb-2">{stage.stage}</p>
                  <p className="text-2xl font-bold text-aqua-500 mb-3">
                    {stage.count}
                  </p>
                  <ul className="space-y-1 text-xs text-ink-600">
                    {stage.deals.slice(0, 2).map((deal) => (
                      <li key={deal} className="truncate">
                        • {deal}
                      </li>
                    ))}
                    {stage.deals.length > 2 && (
                      <li className="text-ink-400">
                        +{stage.deals.length - 2} more
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-card rounded-radius-md shadow-card p-6 border border-hairline">
          <h2 className="text-h3 text-ink-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="pb-4 border-b border-hairline last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                      activity.type === "deal"
                        ? "bg-success"
                        : activity.type === "payment"
                          ? "bg-aqua-500"
                          : activity.type === "match"
                            ? "bg-info"
                            : "bg-warning"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-ink-900 truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-ink-600 mt-1">
                      {activity.detail}
                    </p>
                    <p className="text-xs text-ink-400 mt-2">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
