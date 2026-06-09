// Deterministic, curated property photography.
//
// Properties don't carry an uploaded image yet (that needs a Convex schema field
// + file storage — see FEATURE.md "next"). Until then we map each property to a
// stable, type-appropriate photo so the same listing always shows the same image.
// A gradient fills behind, so a failed image load degrades gracefully.

import type { Property } from "./types";

const POOLS: Record<string, string[]> = {
  villa: [
    "photo-1568605114967-8130f3a36994",
    "photo-1570129477492-45c003edd2be",
    "photo-1564013799919-ab600027ffc6",
    "photo-1512917774080-9991f1c4c750",
  ],
  apartment: [
    "photo-1545324418-cc1a3fa10c00",
    "photo-1493809842364-78817add7ffb",
    "photo-1502672260266-1c1ef2d93688",
    "photo-1522708323590-d24dbb6b0267",
  ],
  office: [
    "photo-1497366754035-f200968a6e72",
    "photo-1497366811353-6870744d04b2",
    "photo-1486406146926-c627a92ad1ab",
  ],
  land: [
    "photo-1500382017468-9049fed747ef",
    "photo-1501594907352-04cda38ebc29",
    "photo-1416331108676-a22ccb276e35",
  ],
  commercial: [
    "photo-1577415124269-fc1140a69e91",
    "photo-1444084316824-dc26d6657664",
    "photo-1486406146926-c627a92ad1ab",
  ],
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/** Stable photo URL for a property, sized for the requested width. */
export function propertyImage(p: Pick<Property, "_id" | "type" | "name">, width = 800): string {
  const pool = POOLS[p.type] ?? POOLS.apartment;
  const id = pool[hash(p._id || p.name) % pool.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=70`;
}
