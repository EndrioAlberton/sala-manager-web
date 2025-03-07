import { Card, CardContent, Typography } from '@mui/material';
import { ClassRoom } from '../types/ClassRoom';

interface ClassroomCardProps {
  classroom: ClassRoom;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sala {classroom.roomNumber}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Prédio: {classroom.building}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Andar: {classroom.floor}
        </Typography>
        <Typography variant="body2">
          Capacidade: {classroom.maxStudents} alunos
        </Typography>
        <Typography variant="body2">
          Mesas: {classroom.desks}
        </Typography>
        <Typography variant="body2">
          Cadeiras: {classroom.chairs}
        </Typography>
        {classroom.computers !== undefined && (
          <Typography variant="body2">
            Computadores: {classroom.computers}
          </Typography>
        )}
        {classroom.projectors !== undefined && (
          <Typography variant="body2">
            Projetores: {classroom.projectors}
          </Typography>
        )}
        <Typography variant="body2" color={classroom.isOccupied ? 'error' : 'success'}>
          Status: {classroom.isOccupied ? 'Ocupada' : 'Disponível'}
        </Typography>
        {classroom.currentTeacher && (
          <Typography variant="body2">
            Professor: {classroom.currentTeacher}
          </Typography>
        )}
        {classroom.currentSubject && (
          <Typography variant="body2">
            Disciplina: {classroom.currentSubject}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
} 