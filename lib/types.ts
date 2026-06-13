// TypeScript types for all domain entities.
// These mirror the Convex schema but are usable on the client without importing Convex internals.

import type {
  PropertyType, ListingType, PropertyStatus,
  ClientType, ClientStatus,
  DealStage, DealType,
  AgentRole, ActivityType, EntityType,
} from "./constants";

// ─── Base ──────────────────────────────────────────────────────────────────────

export interface BaseDoc {
  _id: string;
  _creationTime: number;
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export interface Agent extends BaseDoc {
  name: string;
  email: string;
  phone?: string;
  role: AgentRole;
  isActive: boolean;
}

// ─── Property ─────────────────────────────────────────────────────────────────

export interface Property extends BaseDoc {
  name: string;
  address: string;
  city: string;
  area?: string;
  type: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  size: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  features?: string[];
  description?: string;
  agentId?: string;
  latitude?: number;
  longitude?: number;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export interface Client extends BaseDoc {
  clientType: ClientType;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  nationality?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredPropertyTypes?: string[];
  preferredLocations?: string[];
  notes?: string;
  status: ClientStatus;
  agentId?: string;
}

// ─── Deal ─────────────────────────────────────────────────────────────────────

export interface Deal extends BaseDoc {
  propertyId: string;
  buyerId?: string;
  sellerId?: string;
  agentId: string;
  dealType: DealType;
  stage: DealStage;
  listPrice: number;
  agreedPrice?: number;
  commissionRate: number;
  commissionAmount?: number;
  contractDate?: number;
  handoverDate?: number;
  notes?: string;
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export interface ActivityEntry extends BaseDoc {
  entityType: EntityType;
  entityId: string;
  activityType: ActivityType;
  content: string;
  agentId?: string;
}

// ─── Hydrated / composite types ───────────────────────────────────────────────

export interface HydratedDeal extends Deal {
  property: Property | null;
  buyer: Client | null;
  seller: Client | null;
  agent: Agent | null;
}

export interface ClientProfile {
  client: Client;
  deals: Deal[];
  properties: (Property | null)[];
  activity: ActivityEntry[];
}

export interface DashboardStats {
  overview: {
    totalProperties: number;
    activeListings: number;
    totalClients: number;
    activeClients: number;
    closedDealsAllTime: number;
    closedDealsThisMonth: number;
    totalRevenue: number;
    totalCommission: number;
    revenueThisMonth: number;
    commissionThisMonth: number;
  };
  propertiesByStatus: Record<string, number>;
  dealsByStage: Record<string, number>;
  pipeline: {
    _id: string;
    _creationTime: number;
    stage: DealStage;
    dealType: DealType;
    listPrice: number;
    agreedPrice?: number;
    propertyName: string;
    buyerName: string | null;
  }[];
}

// ─── Form payloads ────────────────────────────────────────────────────────────

export type PropertyFormData = Omit<Property, keyof BaseDoc | "status">;
export type ClientFormData   = Omit<Client, keyof BaseDoc | "status">;
export type DealFormData     = Omit<Deal, keyof BaseDoc | "stage" | "commissionAmount">;
