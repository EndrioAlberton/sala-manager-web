import { z } from 'zod';

export const occupationSchema = z.object({
  teacher: z.string().min(1, 'Professor é obrigatório'),
  disciplina: z.string()
    .min(3, 'Disciplina deve ter no mínimo 3 caracteres')
    .max(100, 'Disciplina deve ter no máximo 100 caracteres'),
  startDate: z.string().min(1, 'Data inicial é obrigatória'),
  endDate: z.string().min(1, 'Data final é obrigatória'),
  startTime: z.string().min(1, 'Horário inicial é obrigatório'),
  endTime: z.string().min(1, 'Horário final é obrigatório'),
  daysOfWeek: z.array(z.number())
    .min(1, 'Selecione pelo menos um dia da semana')
    .max(7, 'Máximo de 7 dias da semana')
});

export type OccupationData = z.infer<typeof occupationSchema>; 