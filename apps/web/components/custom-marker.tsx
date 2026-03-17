// custom-marker.tsx

import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker } from "react-leaflet";

interface CustomMarkerProps {
  position: L.LatLngExpression;
  device: any;
  children: React.ReactNode; // Content to display inside the marker,
  fillLevel: number | null; // Fill level of the bin, can be null if not available
}

/**
 * CustomMarker is a React functional component that renders a Leaflet Marker
 * with a custom icon based on the device's fill level and battery status.
 *
 * @param position - The geographical position of the marker as a [latitude, longitude] tuple.
 * @param device - The device object containing status information such as battery level and device presence.
 * @param children - Optional React children to be rendered inside the Marker (e.g., popups or tooltips).
 * @param fillLevel - The fill level of the device, used to determine the marker icon color.
 *
 * The marker icon changes based on the following logic:
 * - Grey icon: If fillLevel is null/undefined or device is missing.
 * - Low battery icon: If device battery level is 5% or less.
 * - Green icon: If fillLevel is 40% or less.
 * - Yellow icon: If fillLevel is between 41% and 70%.
 * - Red icon: If fillLevel is above 70%.
 *
 * The marker is not rendered if the position is [0, 0].
 */
const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  device,
  children,
  fillLevel,
}) => {
  const customIconGreen = L.icon({
    iconUrl: "binGreen.svg",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });
  const customIconYellow = L.icon({
    iconUrl: "binYellow.svg",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });
  const customIconRed = L.icon({
    iconUrl: "binRed.svg",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });
  const customIconLowBattery = L.icon({
    iconUrl: "batteryLow.svg",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });

  const customIconGrey = L.icon({
    iconUrl: "binGrey.svg",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });

  if (
    Array.isArray(position) &&
    position.length === 2 &&
    position[0] === 0 &&
    position[1] === 0
  ) {
    return null; // Don't render the marker if the position is (0, 0)
  }
  const getMarkerIcon = () => {
    if (fillLevel === null || !device.has_device || fillLevel === undefined) {
      return customIconGrey;
    }
    if (device.battery_level <= 5) {
      return customIconLowBattery;
    }
    if (fillLevel <= 40) {
      return customIconGreen;
    }
    if (fillLevel <= 70) {
      return customIconYellow;
    }

    return customIconRed;
  };

  return (
    <Marker icon={getMarkerIcon()} position={position}>
      {children}
    </Marker>
  );
};

export default CustomMarker;
