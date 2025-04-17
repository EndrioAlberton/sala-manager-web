export enum UserType {
    ALUNO = 'aluno',
    PROFESSOR = 'professor',
    ADMIN = 'admin'
}

export interface User {
    id: number;
    name: string;
    email: string;
    userType: UserType;
} 