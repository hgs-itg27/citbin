"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
} from "@heroui/react";

import {
  TrashbinCreate,
  TrashbinResponse,
  TrashbinUpdate,
  updateTrashbinData,
  createTrashbin,
  DeviceResponse,
  createDevice, // Added createDevice
  deleteDevice,
} from "@/utils/apiClient";
import { TrashbinStatus, statusConfig } from "@/components/StatusLabel";
import { formatDateTime } from "@/utils/formatters";

interface TrashbinFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  formData: Partial<TrashbinCreate | TrashbinUpdate>;
  setFormData: React.Dispatch<
    React.SetStateAction<Partial<TrashbinCreate | TrashbinUpdate>>
  >;
  isEditMode: boolean;
  isLoading: boolean;
  actionError: string | null;
  setActionError: React.Dispatch<React.SetStateAction<string | null>>;
  currentTrashbin: TrashbinResponse | null;
  trashbinTypes: string[];
  devices: DeviceResponse[]; // New prop for sensor data
  deviceProfiles: string[]; // New prop for device profiles
  routerRefresh: () => void; // Callback to refresh router
  onDeviceCreated: (trashbinId: string) => void; // Callback to refresh devices after creation
}

/**
 * TrashbinFormModal component provides a modal dialog for creating or editing a trashbin entity,
 * including form fields for all relevant trashbin properties and management of associated sensor devices.
 *
 * Features:
 * - Supports both creation and editing of trashbins.
 * - Validates required fields and coordinates (latitude/longitude).
 * - Allows viewing, adding, and deleting sensor devices associated with a trashbin (in edit mode).
 * - Displays error messages for both trashbin and device actions.
 * - Integrates with parent state for form data, loading, error handling, and device refresh.
 * - Uses custom UI components for consistent styling and accessibility.
 *
 * Props:
 * @param isOpen - Controls whether the modal is open.
 * @param onOpenChange - Callback to open/close the modal.
 * @param formData - Current form data for the trashbin.
 * @param setFormData - Setter for updating trashbin form data.
 * @param isEditMode - Indicates if the modal is in edit mode (vs. create mode).
 * @param isLoading - Indicates if a save operation is in progress.
 * @param actionError - Error message for trashbin actions.
 * @param setActionError - Setter for updating the trashbin action error.
 * @param currentTrashbin - The trashbin being edited (if in edit mode).
 * @param trashbinTypes - List of available trashbin types.
 * @param devices - List of sensor devices assigned to the trashbin.
 * @param deviceProfiles - List of available device profiles for new sensors.
 * @param routerRefresh - Callback to refresh parent data after changes.
 * @param onDeviceCreated - Callback to refresh device list after device creation/deletion.
 *
 * @returns A modal dialog with a form for trashbin data and device management.
 */
export const TrashbinFormModal = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  isEditMode,
  isLoading,
  actionError,
  setActionError,
  currentTrashbin,
  trashbinTypes,
  devices,
  deviceProfiles,
  routerRefresh,
  onDeviceCreated,
}: TrashbinFormModalProps) => {
  const [newDeviceFormData, setNewDeviceFormData] = useState({
    devEui: "",
    deviceProfileName: "",
  });
  const [isCreatingDevice, setIsCreatingDevice] = useState(false);
  const [deviceActionError, setDeviceActionError] = useState<string | null>(
    null,
  );

  const handleInputChange = (name: string, value: string | number | null) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };

      return newState;
    });
  };

  const handleNewDeviceInputChange = (name: string, value: string) => {
    setNewDeviceFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNewDevice = async () => {
    if (!currentTrashbin || !currentTrashbin.id) {
      setDeviceActionError(
        "Kein Mülleimer ausgewählt, um einen Sensor hinzuzufügen.",
      );

      return;
    }
    if (!newDeviceFormData.devEui || !newDeviceFormData.deviceProfileName) {
      setDeviceActionError("Bitte DevEUI und Geräteprofilnamen eingeben.");

      return;
    }

    setIsCreatingDevice(true);
    setDeviceActionError(null);

    try {
      await createDevice({
        devEui: newDeviceFormData.devEui,
        deviceProfileName: newDeviceFormData.deviceProfileName,
        trashbin_id: currentTrashbin.id,
      });
      setNewDeviceFormData({ devEui: "", deviceProfileName: "" }); // Clear form
      onDeviceCreated(currentTrashbin.id); // Refresh device list in parent
    } catch (err) {
      setDeviceActionError(
        err instanceof Error
          ? err.message
          : "Sensor konnte nicht hinzugefügt werden.",
      );
    } finally {
      setIsCreatingDevice(false);
    }
  };

  const handleDeleteDevice = async (
    deviceId: string,
    devEui: string | null,
  ) => {
    // Using a custom modal for confirmation is better than window.confirm
    // but for this example, we'll stick to the original implementation.
    if (
      !confirm(
        `Möchten Sie den Sensor mit DevEUI "${devEui}" wirklich löschen?`,
      )
    ) {
      return;
    }

    setDeviceActionError(null);

    try {
      await deleteDevice(deviceId);
      if (currentTrashbin) {
        onDeviceCreated(currentTrashbin.id); // Refresh device list
      }
    } catch (err) {
      setDeviceActionError(
        err instanceof Error
          ? err.message
          : "Sensor konnte nicht gelöscht werden.",
      );
    }
  };

  const handleFormSubmit = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.type ||
      !formData.location ||
      !formData.status
    ) {
      setActionError("Bitte füllen Sie alle Pflichtfelder aus.");

      return;
    }

    // Validation for Latitude and Longitude
    if (
      (formData.latitude !== null && isNaN(formData.latitude as number)) ||
      (formData.longitude !== null && isNaN(formData.longitude as number))
    ) {
      setActionError(
        "Bitte geben Sie gültige Werte für Latitude und Longitude ein.",
      );

      return;
    }

    setActionError(null);

    try {
      let apiData: TrashbinCreate | TrashbinUpdate;

      if (isEditMode && currentTrashbin) {
        // Update mode
        apiData = {
          id: currentTrashbin.id,
          name: formData.name || "",
          type: formData.type || "",
          location: formData.location || "",
          status: formData.status || "",
          latitude: formData.latitude === null ? undefined : formData.latitude,
          longitude:
            formData.longitude === null ? undefined : formData.longitude,
          last_update_time: currentTrashbin.last_update_time,
          latest_data_id: currentTrashbin.latest_data_id,
        };
        await updateTrashbinData(currentTrashbin.id, apiData);
      } else {
        // Create mode
        const newTrashbinData: TrashbinCreate = {
          name: formData.name || "",
          type: formData.type || "",
          location: formData.location || "",
          status: formData.status || "",
          device_id: (formData as TrashbinCreate).device_id || null,
          // Optional: Latitude and Longitude
          ...(formData.latitude !== null && { latitude: formData.latitude }),
          ...(formData.longitude !== null && {
            longitude: formData.longitude,
          }),
        };

        apiData = newTrashbinData;
        await createTrashbin(apiData);
      }

      onOpenChange(false); // Close modal on success
      routerRefresh(); // Refresh data in parent
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : isEditMode
            ? "Mülleimer konnte nicht aktualisiert werden."
            : "Mülleimer konnte nicht hinzugefügt werden.",
      );
    } finally {
      // setIsLoading(false); // Loading state should be managed by parent or form itself
    }
  };

  return (
    <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-3xl">
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
          >
            <ModalHeader className="flex flex-col gap-1">
              {isEditMode ? "Mülleimer bearbeiten" : "Mülleimer hinzufügen"}
            </ModalHeader>
            {/* KEY CHANGE: Added overflow-y-auto and a max-height to make the modal body
              scrollable on smaller viewports, preventing content from being cut off.
              The max-height is calculated to leave space for the modal header and footer.
            */}
            <ModalBody className="text-gray-500 dark:text-gray-400 dark:text-white overflow-y-auto max-h-[calc(100vh-16rem)]">
              {actionError && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:border-red-600 dark:text-red-200 mb-4">
                  <p className="font-bold">Fehler:</p>
                  <p>{actionError}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                  <Input
                    required
                    classNames={{
                      input: "text-gray-900 dark:text-white",
                      label: "text-gray-700 dark:text-gray-300",
                      inputWrapper: "dark:bg-gray-700 dark:border-gray-600",
                    }}
                    label={
                      <span>
                        Name <span className="text-red-500">*</span>
                      </span>
                    }
                    name="name"
                    value={formData.name ?? ""}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div>
                  <Select
                    required
                    classNames={{
                      base: "text-gray-900 dark:text-white",
                      label: "text-gray-700 dark:text-gray-300",
                      trigger: "dark:bg-gray-700 dark:border-gray-600",
                      value: "text-gray-900 dark:text-white",
                      popoverContent: "dark:bg-gray-800",
                    }}
                    label={
                      <span>
                        Typ <span className="text-red-500">*</span>
                      </span>
                    }
                    name="type"
                    selectedKeys={formData.type ? [formData.type] : []}
                    onSelectionChange={(keys) =>
                      handleInputChange("type", Array.from(keys)[0] as string)
                    }
                  >
                    {trashbinTypes.map((type) => (
                      <SelectItem key={type}>{type}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Input
                    required
                    classNames={{
                      input: "text-gray-900 dark:text-white",
                      label: "text-gray-700 dark:text-gray-300",
                      inputWrapper: "dark:bg-gray-700 dark:border-gray-600",
                    }}
                    label={
                      <span>
                        Standort <span className="text-red-500">*</span>
                      </span>
                    }
                    name="location"
                    value={formData.location ?? ""}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div>
                  <Select
                    required
                    classNames={{
                      base: "text-gray-900 dark:text-white",
                      label: "text-gray-700 dark:text-gray-300",
                      trigger: "dark:bg-gray-700 dark:border-gray-600",
                      value: "text-gray-900 dark:text-white",
                      popoverContent: "dark:bg-gray-800",
                    }}
                    label={
                      <span>
                        Status <span className="text-red-500">*</span>
                      </span>
                    }
                    name="status"
                    selectedKeys={formData.status ? [formData.status] : []}
                    onSelectionChange={(keys) =>
                      handleInputChange(
                        "status",
                        Array.from(keys)[0] as TrashbinStatus,
                      )
                    }
                  >
                    {(Object.keys(statusConfig) as TrashbinStatus[]).map(
                      (status) => (
                        <SelectItem
                          key={status}
                          textValue={statusConfig[status].text}
                        >
                          {statusConfig[status].text}
                        </SelectItem>
                      ),
                    )}
                  </Select>
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      classNames={{
                        input: "text-gray-900 dark:text-white",
                        label: "text-gray-700 dark:text-gray-300",
                        inputWrapper: "dark:bg-gray-700 dark:border-gray-600",
                      }}
                      label="Latitude"
                      name="latitude"
                      type="number"
                      value={formData.latitude?.toString() ?? ""}
                      onChange={(e) =>
                        handleInputChange(e.target.name, e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Input
                      classNames={{
                        input: "text-gray-900 dark:text-white",
                        label: "text-gray-700 dark:text-gray-300",
                        inputWrapper: "dark:bg-gray-700 dark:border-gray-600",
                      }}
                      label="Longitude"
                      name="longitude"
                      type="number"
                      value={formData.longitude?.toString() ?? ""}
                      onChange={(e) =>
                        handleInputChange(e.target.name, e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {isEditMode && devices.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Zugeordnete Sensoren
                  </h3>
                  <Table
                    aria-label="Sensoren des Mülleimers"
                    classNames={{
                      wrapper: "dark:bg-gray-800",
                      th: "dark:bg-gray-700 dark:text-gray-300",
                      td: "dark:text-gray-400",
                    }}
                    selectionMode="single"
                  >
                    <TableHeader>
                      <TableColumn key="devEui">DevEUI</TableColumn>
                      <TableColumn key="deviceProfileName">Profil</TableColumn>
                      <TableColumn key="battery_level">Batterie</TableColumn>
                      <TableColumn key="last_seen">Zuletzt gesehen</TableColumn>
                      <TableColumn key="actions">Aktionen</TableColumn>
                    </TableHeader>
                    <TableBody items={devices}>
                      {(item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.devEui}</TableCell>
                          <TableCell>{item.deviceProfileName}</TableCell>
                          <TableCell>{item.battery_level}%</TableCell>
                          <TableCell>
                            {item.last_seen
                              ? formatDateTime(item.last_seen)
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button
                              color="danger"
                              size="sm"
                              variant="bordered"
                              onPress={() =>
                                handleDeleteDevice(item.id, item.devEui)
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
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {isEditMode && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Neuen Sensor hinzufügen
                  </h3>
                  {deviceActionError && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:border-red-600 dark:text-red-200 mb-4">
                      <p className="font-bold">Fehler:</p>
                      <p>{deviceActionError}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        classNames={{
                          input: "text-gray-900 dark:text-white",
                          label: "text-gray-700 dark:text-gray-300",
                          inputWrapper: "dark:bg-gray-700 dark:border-gray-600",
                        }}
                        label="DevEUI"
                        name="devEui"
                        value={newDeviceFormData.devEui}
                        onChange={(e) =>
                          handleNewDeviceInputChange(
                            e.target.name,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Select
                        classNames={{
                          base: "text-gray-900 dark:text-white",
                          label: "text-gray-700 dark:text-gray-300",
                          trigger: "dark:bg-gray-700 dark:border-gray-600",
                          value: "text-gray-900 dark:text-white",
                          popoverContent: "dark:bg-gray-800",
                        }}
                        label="Geräteprofilname"
                        name="deviceProfileName"
                        selectedKeys={
                          newDeviceFormData.deviceProfileName
                            ? [newDeviceFormData.deviceProfileName]
                            : []
                        }
                        onSelectionChange={(keys) =>
                          handleNewDeviceInputChange(
                            "deviceProfileName",
                            Array.from(keys)[0] as string,
                          )
                        }
                      >
                        {deviceProfiles.map((profile) => (
                          <SelectItem key={profile}>{profile}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <Button
                    className="mt-4"
                    color="primary"
                    disabled={isCreatingDevice}
                    onPress={handleCreateNewDevice}
                  >
                    {isCreatingDevice ? "Hinzufügen..." : "Sensor hinzufügen"}
                  </Button>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => onOpenChange(false)}
              >
                Abbrechen
              </Button>
              <Button color="primary" disabled={isLoading} type="submit">
                {isLoading ? "Speichern..." : "Speichern"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
