import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { ClassRoom } from '../types/ClassRoom';
import React, { useState } from 'react';

interface ClassroomCardProps {
  classroom: ClassRoom;
  onEdit: (classroom: ClassRoom) => void;
  onDelete: (classroom: ClassRoom) => void;
  onOccupy: (id: number, teacher: string, subject: string) => Promise<void>;
  onVacate: (id: number) => Promise<void>;
}

export function ClassroomCard({ classroom, onEdit, onDelete, onOccupy, onVacate }: ClassroomCardProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleOccupy = async () => {
    const teacher = prompt('Digite o nome do professor:');
    if (!teacher) return;

    const subject = prompt('Digite o nome da disciplina:');
    if (!subject) return;

    setIsLoading(true);
    try {
      await onOccupy(classroom.id, teacher, subject);
    } catch (error) {
      alert('Erro ao ocupar sala. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVacate = async () => {
    if (!window.confirm('Tem certeza que deseja desocupar esta sala?')) return;

    setIsLoading(true);
    try {
      await onVacate(classroom.id);
    } catch (error) {
      alert('Erro ao desocupar sala. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '100%',
        width: '100%',
        mx: 'auto',
        border: 2,
        borderColor: classroom.isOccupied ? 'error.main' : 'success.main',
        transition: 'border-color 0.3s ease'
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
                  disabled={classroom.isOccupied || isLoading}
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
                  disabled={classroom.isOccupied || isLoading}
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
          <Tooltip title={classroom.isOccupied ? "Desocupar sala" : "Ocupar sala"}>
            <IconButton
              size="small"
              onClick={classroom.isOccupied ? handleVacate : handleOccupy}
              disabled={isLoading}
              color={classroom.isOccupied ? "error" : "success"}
            >
              {classroom.isOccupied ? <PersonRemoveIcon /> : <PersonAddIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
} 