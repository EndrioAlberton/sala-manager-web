import { z } from 'zod';

export const classroomSchema = z.object({
  roomNumber: z.string()
    .min(1, 'Número da sala é obrigatório')
    .max(10, 'Número da sala deve ter no máximo 10 caracteres'),
  floor: z.number()
    .min(0, 'O andar deve ser maior ou igual a 0')
    .max(100, 'O andar deve ser menor ou igual a 100'),
  building: z.string()
    .min(1, 'Prédio é obrigatório')
    .max(50, 'Prédio deve ter no máximo 50 caracteres'),
  desks: z.number()
    .min(1, 'Número de mesas deve ser maior que 0')
    .max(100, 'Número de mesas deve ser menor ou igual a 100'),
  chairs: z.number()
    .min(1, 'Número de cadeiras deve ser maior que 0')
    .max(200, 'Número de cadeiras deve ser menor ou igual a 200'),
  computers: z.number()
    .min(0, 'Número de computadores deve ser maior ou igual a 0')
    .max(50, 'Número de computadores deve ser menor ou igual a 50')
    .optional(),
    hasProjector: z.boolean()
    .optional(),
  maxStudents: z.number()
    .min(1, 'Capacidade máxima deve ser maior que 0')
    .max(200, 'Capacidade máxima deve ser menor ou igual a 200'),
});

export type ClassroomFormData = z.infer<typeof classroomSchema>; 