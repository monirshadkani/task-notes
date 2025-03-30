import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { LoginResponse, LoginCredentials } from "./auth.types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(ENDPOINTS.auth.login, credentials);
  },

  async logout(): Promise<void> {
    return apiClient.post(ENDPOINTS.auth.logout, {});
  },

  async scanQR(qrData: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(ENDPOINTS.auth.qrScan, {
      qr_data: qrData,
    });
  },
};
