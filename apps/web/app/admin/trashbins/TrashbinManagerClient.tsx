// app/admin/trashbins/TrashbinManagerClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Image,
} from "@heroui/react";

import {
  deleteTrashbin,
  DeviceListResponse,
  TrashbinCreate,
  TrashbinListItem,
  TrashbinResponse,
  TrashbinUpdate,
  getDevicesByTrashbinID,
  getDeviceProfiles,
} from "@/utils/apiClient";
import { StatusLabel, TrashbinStatus } from "@/components/StatusLabel";
import { BatteryLabel } from "@/components/BatteryLabel";
import { FillLevelLabel } from "@/components/FillLevelLabel";
import { DateTimeLabel } from "@/components/DateTimeLabel";
import { TrashbinFormModal } from "@/components/TrashbinFormModal";

interface TrashbinManagerProps {
  initialTrashbinsDetails: TrashbinResponse[];
  initialTrashbinItems: TrashbinListItem[];
  initialFetchError: string | null;
  initialPartialError: string | null;
  deviceList: DeviceListResponse[];
  trashbinTypes: string[];
}

/**
 * TrashbinManager is a React component for managing trashbins in the admin interface.
 * 
 * This component provides a UI for listing, adding, editing, and deleting trashbins,
 * as well as handling authentication for admin actions. It supports sorting, error handling,
 * and displays device and battery information associated with each trashbin.
 * 
 * @component
 * @param {Readonly<TrashbinManagerProps>} props - The props for TrashbinManager.
 * @param {TrashbinResponse[]} props.initialTrashbinsDetails - Initial list of trashbin details to display.
 * @param {TrashbinItemResponse[]} props.initialTrashbinItems - Initial list of trashbin items for count and reference.
 * @param {string | null} props.initialFetchError - Error message if fetching trashbin data failed.
 * @param {string | null} props.initialPartialError - Warning message if partial data could not be loaded.
 * @param {DeviceListResponse[]} props.deviceList - List of devices associated with trashbins.
 * @param {string[]} props.trashbinTypes - List of available trashbin types for selection.
 * 
 * @returns {JSX.Element} The rendered TrashbinManager component.
 * 
 * @remarks
 * - Handles authentication state using sessionStorage.
 * - Provides modals for login and trashbin form (add/edit).
 * - Allows sorting of trashbin list by various columns.
 * - Displays error and loading states.
 * - Integrates with device and battery information for each trashbin.
 * 
 * @example
 * ```tsx
 * <TrashbinManager
 *   initialTrashbinsDetails={...}
 *   initialTrashbinItems={...}
 *   initialFetchError={null}
 *   initialPartialError={null}
 *   deviceList={...}
 *   trashbinTypes={["Restmüll", "Papier", "Bio"]}
 * />
 * ```
 */
export default function TrashbinManager({
  initialTrashbinsDetails,
  initialTrashbinItems,
  initialFetchError,
  initialPartialError,
  deviceList,
  trashbinTypes,
}: Readonly<TrashbinManagerProps>) {
  const router = useRouter();
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onOpenChange: onFormOpenChange,
  } = useDisclosure();
  const {
    isOpen: isAuthOpen,
    onOpen: onAuthOpen,
    onOpenChange: onAuthOpenChange,
  } = useDisclosure();
  const [currentTrashbin, setCurrentTrashbin] =
    useState<TrashbinResponse | null>(null);
  const [currentTrashbinDevices, setCurrentTrashbinDevices] = useState<
    DeviceListResponse[]
  >([]);
  const [deviceProfiles, setDeviceProfiles] = useState<string[]>([]);
  const [formData, setFormData] = useState<
    Partial<TrashbinCreate | TrashbinUpdate>
  >({
    name: "",
    type: "",
    location: "",
    status: "aktiv",
    device_id: null,
    latitude: null,
    longitude: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof TrashbinResponse | null>(
    "name",
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });

  useEffect(() => {
    // Check session storage on component mount
    if (sessionStorage.getItem("credentials")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    const credentials = btoa(`${authForm.username}:${authForm.password}`);

    sessionStorage.setItem("credentials", credentials);
    setIsLoggedIn(true);
    onAuthOpenChange();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("credentials");
    setIsLoggedIn(false);
  };

  const fetchDevicesForCurrentTrashbin = async (trashbinId: string) => {
    try {
      const devices = await getDevicesByTrashbinID(trashbinId);

      setCurrentTrashbinDevices(devices);
    } catch (error) {
      console.error("Fehler beim Laden der Geräte für den Mülleimer:", error);
    }
  };

  const handleAddClick = async () => {
    setIsEditMode(false);
    setCurrentTrashbin(null);
    setFormData({
      name: "",
      type: "aktiv",
      location: "",
      status: "aktiv",
      device_id: null,
      latitude: null,
      longitude: null,
    });
    try {
      const profiles = await getDeviceProfiles();

      setDeviceProfiles(profiles);
    } catch (error) {
      console.error("Failed to fetch device profiles", error);
    }
    onFormOpen();
  };

  const handleEditClick = async (trashbin: TrashbinResponse) => {
    setIsEditMode(true);
    setCurrentTrashbin(trashbin);
    const filteredDevices = deviceListForTrashbins.filter(
      (device) => device.trashbin_id === trashbin.id,
    );

    setCurrentTrashbinDevices(filteredDevices);
    setFormData({
      name: trashbin.name,
      type: trashbin.type,
      location: trashbin.location,
      status: trashbin.status,
      latitude: trashbin.latitude ?? null,
      longitude: trashbin.longitude ?? null,
      id: trashbin.id,
      last_update_time: trashbin.last_update_time,
      latest_data_id: trashbin.latest_data_id,
    });
    try {
      const profiles = await getDeviceProfiles();

      setDeviceProfiles(profiles);
    } catch (error) {
      console.error("Failed to fetch device profiles", error);
    }
    onFormOpen();
  };

  const handleSort = (column: keyof TrashbinResponse) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDeleteTrashbin = async (
    trashbinId: string,
    trashbinName: string | undefined,
  ) => {
    if (
      !confirm(
        `Möchten Sie den Mülleimer "${
          trashbinName || trashbinId
        }" wirklich löschen?`,
      )
    ) {
      return;
    }

    setIsLoading(true);
    setActionError(null);
    try {
      await deleteTrashbin(trashbinId);
      router.refresh();
    } catch (err) {
      console.error(`Fehler beim Löschen von Mülleimer ${trashbinId}:`, err);
      setActionError(
        err instanceof Error
          ? err.message
          : "Mülleimer konnte nicht gelöscht werden.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sortedTrashbins = React.useMemo(() => {
    let sortableItems = [...initialTrashbinsDetails];

    if (sortColumn) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        let comparison = 0;

        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else if (aValue === null) {
          comparison = 1;
        } else if (bValue === null) {
          comparison = -1;
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return sortableItems;
  }, [initialTrashbinsDetails, sortColumn, sortDirection]);

  const trashbinsDetails = sortedTrashbins;
  const trashbinItemsCount = initialTrashbinItems.length;
  const fetchError = initialFetchError;
  const partialError = initialPartialError;
  const deviceListForTrashbins = deviceList || [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Mülleimerverwaltung
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Übersicht und Verwaltung Ihrer Mülleimer.
          </p>
        </div>
        {isLoggedIn ? (
          <Button color="danger" onPress={handleLogout}>
            Ausloggen
          </Button>
        ) : (
          <Button onPress={onAuthOpen}>Anmelden</Button>
        )}
      </div>

      <Button className="mb-6" color="success" onPress={handleAddClick}>
        Mülleimer hinzufügen
      </Button>

      <TrashbinFormModal
        actionError={actionError}
        currentTrashbin={currentTrashbin}
        deviceProfiles={deviceProfiles}
        devices={currentTrashbinDevices}
        formData={formData}
        isEditMode={isEditMode}
        isLoading={isLoading}
        isOpen={isFormOpen}
        routerRefresh={router.refresh}
        setActionError={setActionError}
        setFormData={setFormData}
        trashbinTypes={trashbinTypes}
        onDeviceCreated={fetchDevicesForCurrentTrashbin}
        onOpenChange={onFormOpenChange}
      />

      <Modal isOpen={isAuthOpen} onOpenChange={onAuthOpenChange}>
        <ModalContent>
          <ModalHeader>Anmelden</ModalHeader>
          <ModalBody>
            <Input
              label="Benutzername"
              value={authForm.username}
              onChange={(e) =>
                setAuthForm({ ...authForm, username: e.target.value })
              }
            />
            <Input
              label="Passwort"
              type="password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onAuthOpenChange}>
              Abbrechen
            </Button>
            <Button color="primary" onPress={handleLogin}>
              Anmelden
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="mt-4 space-y-4">
        {fetchError && (
          <div
            className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:border-red-600 dark:text-red-200"
            role="alert"
          >
            <p className="font-bold">Fehler beim Laden</p>
            <p>{fetchError}</p>
          </div>
        )}
        {partialError && !fetchError && (
          <div
            className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-200"
            role="alert"
          >
            <p className="font-bold">Warnung</p>
            <p>{partialError}</p>
          </div>
        )}
        {actionError && (
          <div
            className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:border-red-600 dark:text-red-200"
            role="alert"
          >
            <p className="font-bold">Aktion fehlgeschlagen oder Hinweis</p>
            <p>{actionError}</p>
          </div>
        )}
        {isLoading && (
          <output className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200">
            <p>Aktion wird ausgeführt...</p>
          </output>
        )}
        {!fetchError && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              Mülleimerliste ({trashbinsDetails.length} angezeigt /{" "}
              {trashbinItemsCount} gesamt)
            </h3>
            {trashbinsDetails.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        scope="col"
                        onClick={() => handleSort("latest_fill_level")}
                      >
                        Füllstand
                        {sortColumn === "latest_fill_level" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        scope="col"
                        onClick={() => handleSort("name")}
                      >
                        Name
                        {sortColumn === "name" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        scope="col"
                        onClick={() => handleSort("type")}
                      >
                        Typ
                        {sortColumn === "type" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        scope="col"
                        onClick={() => handleSort("location")}
                      >
                        Standort
                        {sortColumn === "location" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        scope="col"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        {sortColumn === "status" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        scope="col"
                        onClick={() => handleSort("last_update_time")}
                      >
                        Letztes Update
                        {sortColumn === "last_update_time" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        scope="col"
                      >
                        Batterie
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        scope="col"
                      >
                        Aktionen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {trashbinsDetails.map((trashbin) => (
                      <tr
                        key={trashbin.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <FillLevelLabel
                            level={trashbin.latest_fill_level ?? null}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-bold">
                          {trashbin.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {trashbin.type}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {trashbin.location}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <StatusLabel
                            status={trashbin.status as TrashbinStatus}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <DateTimeLabel
                            isoString={trashbin.last_update_time}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {/* Batterie */}
                          {deviceListForTrashbins
                            .filter(
                              (device) => device.trashbin_id === trashbin.id,
                            )
                            .map((device) => (
                              <BatteryLabel
                                key={device.id}
                                level={device.battery_level}
                              />
                            ))}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            color="warning"
                            disabled={isLoading}
                            size="sm"
                            variant="bordered"
                            onPress={() => handleEditClick(trashbin)}
                          >
                            <Image
                              alt="Einstellungen"
                              className="stroke-gray-500 dark:stroke-gray-300"
                              height={20}
                              src="/actions/settings-outline.svg"
                              width={20}
                            />
                          </Button>
                          <Button
                            color="danger"
                            disabled={isLoading}
                            size="sm"
                            variant="bordered"
                            onPress={() =>
                              handleDeleteTrashbin(trashbin.id, trashbin.name)
                            }
                          >
                            <Image
                              alt="Löschen"
                              className="stroke-gray-500 dark:stroke-gray-300"
                              height={20}
                              src="/actions/delete-outline.svg"
                              width={20}
                            />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {trashbinItemsCount > 0
                    ? "Konnte keine Mülleimerdetails laden oder alle wurden gelöscht."
                    : "Keine Mülleimer gefunden."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
