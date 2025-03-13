import { useState, useEffect, Fragment } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Tooltip, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventIcon from '@mui/icons-material/Event';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ClassRoom } from '../types/ClassRoom';
import { Occupation } from '../types/Occupation';
import { classroomService, occupationService } from '../services/api';
import { OccupationForm } from './OccupationForm';

interface ClassroomCardProps {
  classroom: ClassRoom & {
    currentOccupation?: Occupation;
  };
  onEdit: (classroom: ClassRoom) => void;
  onDelete: (classroom: ClassRoom) => void;
  onRefresh: () => void;
}

const DAYS_MAP = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado'
};

export function ClassroomCard({ classroom, onEdit, onDelete, onRefresh }: ClassroomCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOccupationFormOpen, setIsOccupationFormOpen] = useState(false);
  const [isOccupationsDialogOpen, setIsOccupationsDialogOpen] = useState(false);
  const [occupations, setOccupations] = useState<Occupation[]>([]);

  const loadOccupations = async () => {
    try {
      const occupationsData = await occupationService.findByRoom(classroom.id);
      setOccupations(occupationsData);
    } catch (error) {
      console.error('Erro ao carregar ocupações:', error);
    }
  };

  useEffect(() => {
    loadOccupations();
  }, [classroom.id]);

  const handleDelete = () => {
    if (classroom.currentOccupation) {
      alert('Não é possível deletar uma sala que está ocupada no momento.');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja deletar esta sala?')) {
      onDelete(classroom);
    }
  };

  const handleEdit = () => {
    if (classroom.currentOccupation) {
      alert('Não é possível editar uma sala que está ocupada no momento.');
      return;
    }
    onEdit(classroom);
  };

  const handleOccupy = async (data: {
    teacher: string;
    subject: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  }) => {
    setIsLoading(true);
    try {
      // Verificar disponibilidade primeiro
      const isAvailable = await occupationService.checkAvailability({
        roomId: classroom.id,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        startTime: data.startTime,
        endTime: data.endTime,
        daysOfWeek: data.daysOfWeek
      });

      if (!isAvailable) {
        alert('Esta sala já está ocupada no período selecionado.');
        return;
      }

      await occupationService.create({
        roomId: classroom.id,
        teacher: data.teacher,
        subject: data.subject,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        startTime: data.startTime,
        endTime: data.endTime,
        daysOfWeek: data.daysOfWeek
      });
      
      setIsOccupationFormOpen(false);
      loadOccupations();
      onRefresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatOccupationPeriod = (occupation: Occupation) => {
    const startDate = format(new Date(occupation.startDate), 'dd/MM/yyyy', { locale: ptBR });
    const endDate = format(new Date(occupation.endDate), 'dd/MM/yyyy', { locale: ptBR });
    const days = occupation.daysOfWeek.map(day => DAYS_MAP[day as keyof typeof DAYS_MAP]).join(', ');
    
    return `${startDate} até ${endDate}\n${occupation.startTime} às ${occupation.endTime}\n${days}`;
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
        borderColor: classroom.currentOccupation ? 'error.main' : 'success.main',
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
            <Tooltip title={classroom.currentOccupation ? "Não é possível editar uma sala ocupada" : "Editar"}>
              <span>
                <IconButton 
                  size="small" 
                  onClick={handleEdit}
                  disabled={!!classroom.currentOccupation || isLoading}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={classroom.currentOccupation ? "Não é possível deletar uma sala ocupada" : "Deletar"}>
              <span>
                <IconButton 
                  size="small" 
                  onClick={handleDelete}
                  disabled={!!classroom.currentOccupation || isLoading}
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
        
        {classroom.currentOccupation ? (
          <>
            <Typography variant="body2" color="textSecondary">
              Professor: {classroom.currentOccupation.teacher}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Disciplina: {classroom.currentOccupation.subject}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Horário: {classroom.currentOccupation.startTime} - {classroom.currentOccupation.endTime}
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
            <Typography variant="body2">
              Projetor: {classroom.hasProjector ? "Sim" : "Não"}
            </Typography>
          </>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Tooltip title="Ocupar sala">
            <IconButton
              size="small"
              onClick={() => setIsOccupationFormOpen(true)}
              disabled={isLoading}
              color="success"
            >
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver ocupações">
            <IconButton
              size="small"
              onClick={() => setIsOccupationsDialogOpen(true)}
              disabled={isLoading}
              color="primary"
            >
              <EventIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>

      <OccupationForm
        open={isOccupationFormOpen}
        onClose={() => setIsOccupationFormOpen(false)}
        onSubmit={handleOccupy}
      />

      <Dialog 
        open={isOccupationsDialogOpen} 
        onClose={() => setIsOccupationsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ocupações da Sala {classroom.roomNumber}</DialogTitle>
        <DialogContent>
          {occupations.length === 0 ? (
            <Typography>Nenhuma ocupação registrada</Typography>
          ) : (
            <List>
              {occupations.map((occupation, index) => (
                <Fragment key={`${occupation.teacher}-${occupation.startDate}`}>
                  <ListItem>
                    <ListItemText
                      primary={`${occupation.teacher} - ${occupation.subject}`}
                      secondary={formatOccupationPeriod(occupation)}
                    />
                  </ListItem>
                  {index < occupations.length - 1 && <Divider />}
                </Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
} 