import { useState, useEffect, Fragment } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
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
import { OccupationForm } from './OccupationForm';
import { ClassRoom } from '../types/ClassRoom';
import { Occupation } from '../types/Occupation';
import { authService } from '../services/authService';
import { occupationService } from '../services/api';
import { disciplineService, Discipline } from '../services/disciplineService';

interface ClassroomCardProps {
  classroom: ClassRoom & { currentOccupation?: Occupation };
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
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const currentUser = authService.getCurrentUser();
  const isProfessor = currentUser?.userType?.toLowerCase() === 'professor';
  const isAdmin = authService.isAdmin();

  // Carrega as disciplinas apenas uma vez quando o componente é montado
  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        if (currentUser && isProfessor) {
          const data = await disciplineService.getProfessorDisciplines(currentUser.id);
          setDisciplines(data);
        }
      } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
      }
    };

    loadDisciplines();
  }, [currentUser, isProfessor]);

  // Carrega as ocupações apenas quando a sala muda ou quando uma nova ocupação é adicionada
  useEffect(() => {
    const loadOccupations = async () => {
      try {
        const occupationsData = await occupationService.findByRoom(classroom.id);
        setOccupations(occupationsData);
      } catch (error) {
        console.error('Erro ao carregar ocupações:', error);
      }
    };

    loadOccupations();
  }, [classroom.id]); // Executa apenas quando a sala muda

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
      const occupationsData = await occupationService.findByRoom(classroom.id);
      setOccupations(occupationsData);
      onRefresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const groupOccupations = (occupations: Occupation[]): Occupation[][] => {
    const groups: Record<string, Occupation[]> = {};
    
    occupations.forEach(occupation => {
      const key = `${occupation.teacher}-${occupation.subject}-${occupation.startTime}-${occupation.endTime}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(occupation);
    });

    return Object.values(groups);
  };

  const formatOccupationPeriod = (occupations: Occupation[]) => {
    if (occupations.length === 0) return '';

    const firstOccupation = occupations[0];
    const dates = occupations
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const startDate = format(new Date(firstOccupation.startDate), 'dd/MM/yyyy', { locale: ptBR });
    const endDate = format(new Date(firstOccupation.endDate), 'dd/MM/yyyy', { locale: ptBR });
    
    const dayOfWeek = DAYS_MAP[firstOccupation.daysOfWeek[0] as keyof typeof DAYS_MAP];
    return `${startDate} até ${endDate} (${dayOfWeek}) - ${firstOccupation.startTime} às ${firstOccupation.endTime}`;
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
          <Typography variant="h6" sx={{ fontWeight: 'normal' }}>
            Sala {classroom.roomNumber}
          </Typography>
          {isAdmin && (
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
          )}
        </Box>

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Prédio: {classroom.building}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Andar: {classroom.floor}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Capacidade: {classroom.maxStudents} alunos
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Mesas: {classroom.desks}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Cadeiras: {classroom.chairs}
        </Typography>
        {classroom.computers !== undefined && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Computadores: {classroom.computers}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Projetor: {classroom.hasProjector ? "Sim" : "Não"}
        </Typography>
        
        {classroom.currentOccupation && (
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
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          {isProfessor && (
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
          )}
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
        disciplines={disciplines}
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
              {groupOccupations(occupations).map((group, index) => (
                <Fragment key={`${group[0].teacher}-${group[0].startDate}`}>
                  <ListItem>
                    <ListItemText
                      primary={`${group[0].teacher} - ${group[0].subject}`}
                      secondary={formatOccupationPeriod(group)}
                    />
                  </ListItem>
                  {index < groupOccupations(occupations).length - 1 && <Divider />}
                </Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
} 