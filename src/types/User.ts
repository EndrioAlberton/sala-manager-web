export enum UserType {
    ALUNO = 'ALUNO',
    PROFESSOR = 'PROFESSOR',
    ADMIN = 'ADMIN'
}

export interface User {
    id: number;
    name: string;
    email: string;
    userType: UserType;
} 