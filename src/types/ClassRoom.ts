export interface ClassRoom {
  id: number;
  roomNumber: string;
  building: string;
  floor: number;
  maxStudents: number;
  desks: number;
  chairs: number;
  computers?: number;
  hasProjector: boolean;
  isActive: boolean;
} 