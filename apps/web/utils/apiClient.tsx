// apiClient.tsx
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Typdefinitionen basierend auf OpenAPI Schemas ---
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface DeviceCreate {
  devEui: string | null;
  trashbin_id: string | null;
  deviceProfileName: string | null;
}

export type DeviceListResponse = {
  id: string;
  devEui: string | null;
  trashbin_id: string | null;
  battery_level: number | null;
  last_seen: string | null;
  latest_data_id: number | null;
};

export interface DeviceUpdate {
  id: string;
  devEui: string | null;
  trashbin_id: string | null;
  deviceProfileName: string | null;
  battery_level: number | null; // 0-100
  last_seen: string | null; // ISO Timestamp
  latest_data_id: number | null;
}

export interface DeviceResponse {
  id: string;
  devEui: string | null;
  trashbin_id?: string | null;
  deviceProfileName?: string | null;
  battery_level?: number | null; // 0-100
  last_seen?: string | null; // ISO Timestamp
  latest_data_id?: number | null;
}

export interface TrashbinCreate {
  name: string;
  type: string;
  location: string;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  device_id: string | null;
}

export interface TrashbinDataResponse {
  id: number;
  trashbin_id: string;
  time: string;
  distance?: number | null;
  fill_level?: number | null;
  payload?: string | null;
}

export interface TrashbinListItem {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  latitude: number;
  longitude: number;
  has_device: boolean;
  latest_data_id?: number | null;
  latest_fill_level?: number | null;
}

export interface TrashbinResponse {
  name: string;
  type: string;
  location: string;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  id: string;
  last_update_time?: string | null;
  latest_data_id?: number | null;
  latest_fill_level?: number | null;
}

export interface TrashbinUpdate {
  name: string;
  type: string;
  location: string;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  id: string;
  last_update_time?: string | null;
  latest_data_id?: number | null;
  latest_fill_level?: number | null;
}

const getAuthHeader = () => {
  if (typeof window !== "undefined") {
    const credentials = sessionStorage.getItem("credentials");

    if (credentials) {
      return "Basic " + credentials;
    }
  }

  return "Basic " + btoa("0:0"); // Fallback to default
};

/**
 * Sends an HTTP request to the specified API endpoint and returns the parsed JSON response.
 *
 * @template T - The expected response type.
 * @param endpoint - The API endpoint path (should start with a slash, e.g., "/users").
 * @param method - The HTTP method to use ("GET", "POST", "PUT", "DELETE", or "PATCH").
 * @param body - (Optional) The request payload for methods that support a body (e.g., POST, PUT, PATCH).
 * @param headers - (Optional) Additional headers to include in the request.
 * @returns A promise that resolves to the parsed JSON response of type `T`, or `undefined` for 204 No Content responses.
 * @throws Throws an error if the response status is not OK (non-2xx), including the error details if available.
 *
 * @example
 * ```typescript
 * const user = await apiRequest<User>("/users/1", "GET");
 * ```
 */
async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body?: any,
  headers?: Record<string, string>,
): Promise<T> {
  const baseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const url = `${baseUrl}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      ...headers,
    },
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData: any = null;

      try {
        errorData = await response.json();
      } catch (e) {
        console.error("Failed to parse error response body:", e);
      }
      throw new Error(
        `API Error on ${url}: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`,
      );
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      // @ts-ignore
      return undefined;
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed on ${url}: ${method} ${endpoint}`, error);
    throw error;
  }
}

// --- API Client Funktionen ---

export const checkHealth = (): Promise<any> => {
  return apiRequest<any>("/api/health", "GET");
};

export const getDevices = (): Promise<DeviceListResponse[]> => {
  return apiRequest<DeviceListResponse[]>("/api/v0/device/", "GET");
};

export const createDevice = (
  deviceData: DeviceCreate,
): Promise<DeviceResponse> => {
  return apiRequest<DeviceResponse>("/api/v0/device/", "POST", deviceData);
};

export const getDeviceDetails = (deviceId: string): Promise<DeviceResponse> => {
  return apiRequest<DeviceResponse>(`/api/v0/device/${deviceId}`, "GET");
};

export const updateDevice = (
  deviceId: string,
  deviceData: DeviceUpdate,
): Promise<DeviceResponse> => {
  return apiRequest<DeviceResponse>(
    `/api/v0/device/${deviceId}`,
    "PUT",
    deviceData,
  );
};

export const deleteDevice = (
  deviceId: string,
): Promise<Record<string, any>> => {
  return apiRequest<Record<string, any>>(
    `/api/v0/device/${deviceId}`,
    "DELETE",
  );
};

export const sendHeliumUplink = (
  payload: Record<string, any>,
): Promise<any> => {
  return apiRequest<any>("/api/v0/helium/uplink", "POST", payload);
};

export const getTrashbinList = (): Promise<TrashbinListItem[]> => {
  return apiRequest<TrashbinListItem[]>("/api/v0/trashbin/", "GET");
};

export const createTrashbin = (
  trashbinData: TrashbinCreate,
): Promise<TrashbinCreate> => {
  return apiRequest<TrashbinCreate>("/api/v0/trashbin/", "POST", trashbinData);
};

export const getTrashbin = (trashbin_id: string): Promise<TrashbinResponse> => {
  return apiRequest<TrashbinResponse>(`/api/v0/trashbin/${trashbin_id}`, "GET");
};

export const updateTrashbinData = (
  trashbin_id: string,
  trashbinData: TrashbinUpdate,
): Promise<TrashbinUpdate> => {
  return apiRequest<TrashbinUpdate>(
    `/api/v0/trashbin/${trashbin_id}`,
    "PUT",
    trashbinData,
  );
};

export const deleteTrashbin = (trashbin_id: string) => {
  return apiRequest(`/api/v0/trashbin/${trashbin_id}`, "DELETE");
};

export const getDevicesByTrashbinID = (
  trashbin_id: string,
): Promise<DeviceListResponse[]> => {
  return apiRequest<DeviceListResponse[]>(
    `/api/v0/trashbin/${trashbin_id}/device`,
    "GET",
  );
};

export const getTrashbinTypes = (): Promise<string[]> => {
  return apiRequest("/api/v0/trashbin/types", "GET");
};

export const getDeviceProfiles = (): Promise<string[]> => {
  return apiRequest("/api/v0/device/profiles", "GET");
};
