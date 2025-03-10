import { Card, CardContent, Typography, Box, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ClassRoom } from '../types/ClassRoom';
import React from 'react';

interface ClassroomCardProps {
  classroom: ClassRoom;
  onEdit: (classroom: ClassRoom) => void;
  onDelete: (classroom: ClassRoom) => void;
}

export function ClassroomCard({ classroom, onEdit, onDelete }: ClassroomCardProps) {
  const handleDelete = () => {
    if (classroom.isOccupied) {
      alert('Não é possível deletar uma sala que está ocupada.');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja deletar esta sala?')) {
      onDelete(classroom);
    }
  };

  const handleEdit = () => {
    if (classroom.isOccupied) {
      alert('Não é possível editar uma sala que está ocupada.');
      return;
    }
    onEdit(classroom);
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6">
            Sala {classroom.roomNumber}
          </Typography>
          <Box>
            <Tooltip title={classroom.isOccupied ? "Não é possível editar uma sala ocupada" : "Editar"}>
              <span>
                <IconButton 
                  size="small" 
                  onClick={handleEdit}
                  disabled={classroom.isOccupied}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={classroom.isOccupied ? "Não é possível deletar uma sala ocupada" : "Deletar"}>
              <span>
                <IconButton 
                  size="small" 
                  onClick={handleDelete}
                  disabled={classroom.isOccupied}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
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