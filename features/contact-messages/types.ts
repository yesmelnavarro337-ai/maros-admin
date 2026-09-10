export interface ContactMessage {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}