import { apiFetch } from "@/lib/api/client-fetcher";

export interface InvitationSummary {
  name: string;
  email: string;
}

export async function getInvitationSummary(token: string): Promise<InvitationSummary> {
  return apiFetch<InvitationSummary>(`public/invitations/${encodeURIComponent(token)}`);
}

export async function acceptInvitation(token: string, newPassword: string): Promise<void> {
  await apiFetch<{ message: string }>("public/invitations/accept", {
    method: "POST",
    body: { token, newPassword },
  });
}