// components/DynamicMapLoader.tsx
"use client"; // Keep client directive as leaflet needs the window object

import type { TrashbinListItem } from "@/utils/apiClient";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the Map component with SSR disabled
/**
 * Dynamically imports the Map component with server-side rendering (SSR) disabled.
 *
 * @remarks
 * This component uses Next.js's `dynamic` import to load the Map component only on the client side.
 * While the Map component is loading, a loading indicator with a message "Karte wird geladen..." is displayed.
 *
 * @example
 * ```tsx
 * <MapWithNoSSR />
 * ```
 *
 * @see {@link https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading}
 */
const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  // Ensure path is correct
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <p className="p-5 text-gray-500">Karte wird geladen...</p>
    </div>
  ),
});

interface DynamicMapLoaderProps {
  trashbinList: TrashbinListItem[]; // Expect details array
}

export default function DynamicMapLoader({
  trashbinList,
}: DynamicMapLoaderProps) {
  // Pass the already fetched device details to the Map component
  return <MapWithNoSSR trashbinList={trashbinList} />;
}
