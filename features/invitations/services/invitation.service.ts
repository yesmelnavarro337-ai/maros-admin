import { apiFetch } from "@/lib/api/client-fetcher";

export interface InvitationSummary {
  name: string;
  email: string;
}

export async function getInvitationSummary(token: string): Promise<InvitationSummary> {
  return apiFetch<InvitationSummary>(`public/invitations/${encodeURIComponent(token)}`);
}

export async function acceptInvitation(token: string, newPassword: string, email?: string): Promise<void> {
  await apiFetch<{ message: string }>("Users/accept-invitation", {
    method: "POST",
    body: { token, email, newPassword },
  });
}
