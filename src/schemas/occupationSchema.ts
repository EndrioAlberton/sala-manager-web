import { z } from 'zod';

export const occupationSchema = z.object({
  teacher: z.string().min(3, 'Nome do professor deve ter no mínimo 3 caracteres'),
  subject: z.string().min(3, 'Nome da disciplina deve ter no mínimo 3 caracteres'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data inicial inválida'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data final inválida'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inicial inválido'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário final inválido'),
  daysOfWeek: z.array(z.number().min(0).max(6)).min(1, 'Selecione pelo menos um dia da semana')
});

export type OccupationData = z.infer<typeof occupationSchema>; 