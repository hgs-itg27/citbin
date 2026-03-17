// app/dashboard/page.tsx
import React from "react";

import DynamicMapLoader from "@/components/DynamicMapLoader";
import { getTrashbinList, TrashbinListItem } from "@/utils/apiClient";

// This component fetches data on the server
/**
 * DashboardPage is the main page component for the dashboard view.
 *
 * This async React component is responsible for:
 * - Fetching the list of trashbins from the backend using `getTrashbinList`.
 * - Handling and displaying any errors that occur during data fetching.
 * - Rendering the map container and passing the fetched trashbin list to the `DynamicMapLoader` component.
 * - Displaying a user-friendly error message if the trashbin list could not be loaded.
 *
 * @returns {JSX.Element} The rendered dashboard page, including the map and error messages if applicable.
 */
export default async function DashboardPage() {
  let trashbinList: TrashbinListItem[] = [];
  let fetchError: string | null = null;

  // --- Data Fetching ---
  try {
    trashbinList = await getTrashbinList();
  } catch (err) {
    fetchError = "Fehler beim Laden der Mülleimer.";
  }

  // --- Rendering ---
  return (
    <div className="max-w-full mx-auto h-full">
      {/* Render Map Container */}
      <div className="h-[calc(100vh-110px)]">
        {/* Define a height for the map container */}
        <div
          style={{
            height: "100%",
            width: "100%",
            border: "1px solid transparent",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            position: "relative",
            borderRadius: "0.5rem",
          }}
        >
          {/* Pass the successfully fetched details to the loader */}
          {/* The loader will handle the case where devicesDetails might be empty */}
          <DynamicMapLoader trashbinList={trashbinList} />
        </div>
      </div>
      <br />
      {/* Display general fetch error for the ID list */}
      {fetchError && (
        <div
          className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">Fehler:</span> {fetchError}
        </div>
      )}
    </div>
  );
}
