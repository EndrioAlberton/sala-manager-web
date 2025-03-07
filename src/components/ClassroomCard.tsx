import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { ClassRoom } from '../types/ClassRoom';

interface ClassroomCardProps {
  classroom: ClassRoom;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '100%',
        width: '100%',
        mx: 'auto'
      }}
    >
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 1.5, sm: 2 },
          '&:last-child': { pb: 2 }
        }}
      >
        <Typography variant="h6" gutterBottom>
          Sala {classroom.roomNumber}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Prédio: {classroom.building}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Andar: {classroom.floor}
        </Typography>
        
        {classroom.isOccupied ? (
          <>
            <Typography variant="body2" color="textSecondary">
              Professor: {classroom.currentTeacher}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Disciplina: {classroom.currentSubject}
            </Typography>
          </>
        ) : (
          <>
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
          </>
        )}

        <Box sx={{ mt: 2 }}>
          <Chip 
            label={classroom.isOccupied ? 'Ocupada' : 'Disponível'} 
            color={classroom.isOccupied ? 'error' : 'success'} 
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
} 