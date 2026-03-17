// app/admin/overview/page.tsx
import React from "react";

import TrashbinManager from "../trashbins/TrashbinManagerClient";

// Importieren der notwendigen API-Client Funktionen und Typen
import {
  DeviceListResponse,
  DeviceResponse,
  getDeviceDetails,
  getDevices,
  TrashbinListItem,
  TrashbinResponse,
  getTrashbin,
  getTrashbinList,
  getTrashbinTypes,
} from "@/utils/apiClient";

/**
 * OverviewPage is the main admin overview page component.
 * 
 * This async React Server Component is responsible for fetching and aggregating
 * all necessary data for the admin overview, including device and trashbin management.
 * 
 * ## Data Fetching
 * - Fetches the list of trashbins and their details.
 * - Fetches the list of devices and their details.
 * - Fetches available trashbin types.
 * - Handles and displays errors for each data-fetching step, including partial errors
 *   (e.g., if some device or trashbin details fail to load).
 * 
 * ## Error Handling
 * - Distinguishes between general, device-specific, and trashbin-specific errors.
 * - Displays a critical error message if a general error occurs.
 * - Displays partial error messages if only some details fail to load.
 * 
 * ## Rendering
 * - Renders the `TrashbinManager` section with all relevant props and error states.
 * - (Optionally) renders the `DeviceManager` section (currently commented out).
 * 
 * @returns {JSX.Element} The rendered admin overview page.
 */
export default async function OverviewPage() {
  // --- Daten für Geräteverwaltung ---
  let deviceList: DeviceListResponse[] = [];
  let trashbinTypes: string[] = [];
  let devicesDetails: DeviceResponse[] = [];
  let deviceFetchError: string | null = null;
  let devicePartialError: string | null = null;
  let sharedTrashbinListForDevices: TrashbinListItem[] = [];

  // --- Daten für Mülleimerverwaltung ---
  let trashbinItems: TrashbinListItem[] = [];
  let trashbinsDetails: TrashbinResponse[] = [];
  let trashbinFetchError: string | null = null;
  let trashbinPartialError: string | null = null;

  // --- Allgemeine Fehlerbehandlung ---
  let generalFetchError: string | null = null;

  try {
    try {
      sharedTrashbinListForDevices = await getTrashbinList();
      trashbinItems = sharedTrashbinListForDevices;
    } catch (err) {
      console.error("Failed to fetch initial trashbin list for overview:", err);
      generalFetchError =
        err instanceof Error
          ? err.message
          : "Fehler beim Laden der Mülleimerliste.";

      sharedTrashbinListForDevices = [];
      trashbinItems = [];
    }

    // --- Datenabruf für Geräte ---
    if (!generalFetchError) {
      try {
        deviceList = await getDevices();
        if (deviceList && deviceList.length > 0) {
          const deviceDetailPromises = deviceList.map((device) =>
            getDeviceDetails(device.id).catch((err) => {
              console.error(
                `Error fetching details for device ${device.id} in overview:`,
                err.message ?? err,
              );

              return {
                error: true,
                id: device.id,
                message: err.message || "Unknown error",
              };
            }),
          );
          const deviceResults = await Promise.allSettled(deviceDetailPromises);
          const successfulDeviceDetails: DeviceResponse[] = [];
          const failedDeviceIds: string[] = [];

          deviceResults.forEach((result, index) => {
            if (result.status === "fulfilled" && result.value) {
              successfulDeviceDetails.push(result.value as DeviceResponse);
            } else {
              failedDeviceIds.push(deviceList[index].id);
            }
          });
          devicesDetails = successfulDeviceDetails;
          if (failedDeviceIds.length > 0) {
            devicePartialError = `Konnte Details für ${failedDeviceIds.length} von ${deviceList.length} Gerät(en) nicht laden.`;
          }
        }
      } catch (err) {
        console.error("Failed to fetch device list for overview:", err);
        deviceFetchError =
          err instanceof Error
            ? err.message
            : "Fehler beim Laden der Geräteliste.";
        devicesDetails = []; // Stelle sicher, dass es ein Array ist
        deviceList = [];
      }

      try {
        trashbinTypes = await getTrashbinTypes();
      } catch (err) {
        trashbinTypes = [];
      }
    }

    // --- Datenabruf für Mülleimerdetails (die Liste `trashbinItems` haben wir schon) ---
    if (!generalFetchError && trashbinItems.length > 0) {
      try {
        const trashbinDetailPromises = trashbinItems.map((item) =>
          getTrashbin(item.id).catch((err) => {
            console.error(
              `Error fetching details for trashbin ${item.id} in overview:`,
              err.message ?? err,
            );

            return {
              error: true,
              id: item.id,
              message: err.message ?? "Unknown error fetching detail",
            } as any;
          }),
        );
        const trashbinResults = await Promise.allSettled(
          trashbinDetailPromises,
        );
        const successfulTrashbinDetails: TrashbinResponse[] = [];
        const failedTrashbinIds: string[] = [];

        trashbinResults.forEach((result, index) => {
          if (
            result.status === "fulfilled" &&
            result.value &&
            !result.value.error
          ) {
            successfulTrashbinDetails.push(result.value as TrashbinResponse);
          } else {
            failedTrashbinIds.push(trashbinItems[index].id);
          }
        });
        trashbinsDetails = successfulTrashbinDetails;
        if (failedTrashbinIds.length > 0) {
          trashbinPartialError = `Konnte Details für ${failedTrashbinIds.length} von ${trashbinItems.length} Mülleimer(n) nicht laden.`;
        }
      } catch (err) {
        console.error("Failed to fetch trashbin details for overview:", err);
        trashbinFetchError =
          err instanceof Error
            ? err.message
            : "Fehler beim Laden der Mülleimerdetails.";
        trashbinsDetails = [];
      }
    }
  } catch (e) {
    // Fängt Fehler ab, die nicht spezifisch den API-Calls zugeordnet sind
    console.error("General error in OverviewPage data fetching:", e);
    generalFetchError = "Ein allgemeiner Fehler ist aufgetreten.";
  }

  return (
    <div className="p-4 max-w-full mx-auto">
      {generalFetchError && (
        <div
          className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:border-red-600 dark:text-red-200"
          role="alert"
        >
          <p className="font-bold">Kritischer Fehler beim Laden der Daten</p>
          <p>{generalFetchError}</p>
        </div>
      )}

      {!generalFetchError && (
        <>
          {/* Mülleimerverwaltung Sektion */}
          <section>
            <TrashbinManager
              deviceList={deviceList} // Benötigt für die Anzeige der Geräteverknüpfung
              initialFetchError={trashbinFetchError}
              initialPartialError={trashbinPartialError}
              initialTrashbinItems={trashbinItems}
              initialTrashbinsDetails={trashbinsDetails}
              trashbinTypes={trashbinTypes}
            />
          </section>
    
        </>
      )}
    </div>
  );
}
