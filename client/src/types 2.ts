export interface User {
  id: number;
  email: string;
  createdAt?: string;
}

export interface Address {
  id: number;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  createdAt?: string;
}
