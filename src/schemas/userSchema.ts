import { z } from 'zod';
import { UserType } from '../types/User';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/*
usuario@dominio.com
nome.sobrenome@empresa.com.br
user123@site.org
*/

export const registerSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string()
    .min(1, 'Email é obrigatório')
    .regex(emailRegex, 'Formato de email inválido'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),
  userType: z.nativeEnum(UserType).optional().default(UserType.ALUNO)
});

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>; 