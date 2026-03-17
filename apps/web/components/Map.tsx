// components/Map.tsx
"use client";
import type { TrashbinListItem } from "@/utils/apiClient";

import React from "react";
import { MapContainer, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

import CustomMarker from "@/components/custom-marker";
import { FillLevelLabel } from "@/components/FillLevelLabel";

import "leaflet/dist/leaflet.css";

// Helper function to safely parse location strings
const parseLocation = (
  locationString: string | null | undefined,
): L.LatLngTuple | null => {
  if (!locationString) return null;
  const parts = locationString.split(",").map((part) => part.trim());

  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
  }

  // Avoid console spamming for every invalid entry if many exist
  // console.warn(`Invalid location format: "${locationString}". Expected: "latitude,longitude".`);
  return null;
};

interface MapProps {
  trashbinList: TrashbinListItem[]; // Receive details directly
  // Removed deviceIds prop
}

// Fix for default Leaflet icon path issues with bundlers
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

/**
 * MapComponent displays a map with markers for each trashbin device provided in the `trashbinList` prop.
 * 
 * - Parses and filters trashbin locations to ensure only valid positions are shown.
 * - Dynamically determines map bounds and center based on available trashbin positions.
 * - Renders a map using `MapContainer` from react-leaflet, with OpenStreetMap tiles.
 * - Each trashbin is represented by a `CustomMarker` with a popup showing device details, fill level, and status.
 * - If no valid trashbin locations are available, the map defaults to a predefined center and bounds.
 * 
 * @param trashbinList - Array of trashbin device objects to be displayed on the map.
 * 
 * @returns A React component rendering a map with trashbin markers and popups.
 */
export default function MapComponent({ trashbinList }: MapProps) {
  // Removed useState for devicesDetails, isLoading, fetchError
  // Removed useEffect for fetching data

  const trashbins = trashbinList
    .map((trashbin) => ({
      ...trashbin,
      position: parseLocation(trashbin.latitude + "," + trashbin.longitude), // Parse location
    }))
    .filter((device) => device.position !== null); // Filter devices with valid, parsed positions

  // Determine map bounds or center
  let mapCenter: L.LatLngTuple = [47.76132, 8.85068]; // Default center
  /*
  let southWest = L.latLng(47.6, 8.4);
  let northEast = L.latLng(47.9, 9.2);
  let mapBounds = L.latLngBounds(southWest, northEast);

  if (trashbinList.length > 0) {
    const positions = trashbins.map((d) => d.position as L.LatLngTuple);

    if (positions.length > 0) {
      mapBounds = L.latLngBounds(positions);
      if (mapBounds.isValid()) {
        // @ts-ignore
        mapCenter = mapBounds.getCenter() as L.LatLngTuple;
      }
    }
  }
  */
  // If there are no devices with valid locations, show a message maybe?
  // Or just show the default map view.

  return (
    // MapContainer needs a defined height in its parent or via style
    <MapContainer
      boundsOptions={{ padding: [50, 50] }} // Add padding around markers
      center={mapCenter}
      //maxBounds={mapBounds} // Zoom ignored if bounds is set
      scrollWheelZoom={true} // Disable scroll wheel zoom
      style={{ height: "100%", width: "100%" }} // Takes height from parent
      // Adjust zoom or use bounds
      zoom={15}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trashbins.map((device) => (
        // device.position is guaranteed to be non-null here due to filter
        <CustomMarker
          key={device.id}
          device={device}
          fillLevel={device.latest_fill_level || null} // Use latest_fill_level or default to null
          position={device.position!}
        >
          <Popup>
            <strong className="text-lg">
              <FillLevelLabel level={device.latest_fill_level ?? null} />
              {device.name || `Gerät ${device.id}`}
            </strong>
            <br />
            {device.location && (
              <>
                <em>{device.location}</em>
                <br />
              </>
            )}
            <br />
            {device.type && (
              <>
                <em>Status:</em>&nbsp;{device.status}
                <br />
                {device.has_device ? (
                  <br />
                ) : (
                  <>
                    <span className="text-red-600">Kein Sensor verbunden</span>
                    <br />
                  </>
                )}
                {device.id && (
                  <>
                    <br />
                    ID:
                    <code className="font-mono bg-clip-border bg-grey-900 border-1 p-1">
                      {device.id}
                    </code>
                    <br />
                  </>
                )}
              </>
            )}
            <br />
          </Popup>
        </CustomMarker>
      ))}
    </MapContainer>
  );
}
