export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string | null;
  lastLogin: string;
  active: boolean;
  selected?: boolean;
  status?: string;
}
