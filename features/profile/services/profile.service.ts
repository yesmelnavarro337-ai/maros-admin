import { apiFetch } from "@/lib/api/client-fetcher";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  phone?: string;
  avatarUrl?: string;
  emailNotificationsEnabled?: boolean;
  inAppNotificationsEnabled?: boolean;
}

export interface UpdateProfilePayload {
  name: string;
  phone?: string;
  avatarUrl?: string;
}

export interface VerifyEmailChangePayload {
  codeCurrentEmail: string;
  codeNewEmail: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePreferencesPayload {
  emailNotificationsEnabled: boolean;
  inAppNotificationsEnabled: boolean;
}

export interface UserActivityLog {
  id: string;
  deviceType: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
}

export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("Profile/me");
}

export async function updateProfileBasic(data: UpdateProfilePayload): Promise<UserProfile> {
  return apiFetch<UserProfile>("Profile", {
    method: "PUT",
    body: data,
  });
}

export async function changePassword(data: ChangePasswordPayload): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("Profile/change-password", {
    method: "POST",
    body: data,
  });
}

export async function updatePreferences(data: UpdatePreferencesPayload): Promise<UserProfile> {
  return apiFetch<UserProfile>("Profile/preferences", {
    method: "PUT",
    body: data,
  });
}

export async function getActivityLogs(): Promise<UserActivityLog[]> {
  return apiFetch<UserActivityLog[]>("Profile/activity-logs");
}

export async function requestEmailChange(newEmail: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("Profile/request-email-change", {
    method: "POST",
    body: { newEmail },
  });
}

export async function verifyEmailChange(
  payload: VerifyEmailChangePayload
): Promise<{ message: string; email: string; user: UserProfile }> {
  return apiFetch<{ message: string; email: string; user: UserProfile }>("Profile/verify-email-change", {
    method: "POST",
    body: payload,
  });
}
