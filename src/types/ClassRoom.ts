export interface ClassRoom {
  id: number;
  roomNumber: string;
  floor: number;
  building: string;
  desks: number;
  chairs: number;
  computers?: number;
  hasProjector: boolean;
  maxStudents: number;
  isOccupied: boolean;
  currentTeacher?: string;
  currentSubject?: string;
} 