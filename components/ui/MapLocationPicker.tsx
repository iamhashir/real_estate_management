"use client";

import { useEffect, useRef, useState } from "react";

interface MapLocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
}

export function MapLocationPicker({
  latitude,
  longitude,
  onLocationChange,
  height = "h-64",
}: MapLocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainer.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const defaultLat = latitude || 25.2048;
      const defaultLng = longitude || 55.2708;

      if (!map.current && mapContainer.current) {
        map.current = L.map(mapContainer.current).setView([defaultLat, defaultLng], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map.current);

        map.current.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          updateMarker(lat, lng);
          onLocationChange(lat, lng);
        });
      }

      if (latitude !== undefined && longitude !== undefined) {
        updateMarker(latitude, longitude);
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.off();
      }
    };
  }, [isClient, latitude, longitude, onLocationChange]);

  const updateMarker = (lat: number, lng: number) => {
    if (!map.current) return;

    const L = require("leaflet");

    if (marker.current) {
      map.current.removeLayer(marker.current);
    }

    marker.current = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSI+PHBhdGggZmlsbD0iIzJFNUI2MCIgZD0iTTEyLjUgMGM2LjkwMyAwIDEyLjUgNS41OTcgMTIuNSAxMi41IDAgMTIuNS0xMi41IDI4LjUtMTIuNSAyOC41cy0xMi41LTE2LTEyLjUtMjguNUMwIDUuNTk3IDUuNTk3IDAgMTIuNSAweiIvPjxjaXJjbGUgY3g9IjEyLjUiIGN5PSIxMiIgcj0iNC41IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    })
      .bindPopup(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      .addTo(map.current!);

    map.current.setView([lat, lng], 13);
  };

  if (!isClient) {
    return <div className={`${height} bg-hairline rounded-md`} />;
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink-900">Location on Map</label>
      <div
        ref={mapContainer}
        className={`${height} rounded-md border border-hairline overflow-hidden cursor-pointer hover:border-sea-300 transition-colors`}
      />
      <p className="text-xs text-ink-600">Click on the map to pinpoint the exact location</p>
      {latitude && longitude && (
        <p className="text-xs text-ink-700 bg-surface-card px-3 py-2 rounded-md font-mono">
          📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      )}
    </div>
  );
}
