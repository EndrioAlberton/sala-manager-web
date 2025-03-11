import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Box, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NavigationTabs } from '../components/NavigationTabs';
import { OccupiedSearchBar } from '../components/OccupiedSearchBar';
import { AvailableSearchBar } from '../components/AvailableSearchBar';
import { ClassroomCard } from '../components/ClassroomCard';
import { ClassroomForm } from '../components/ClassroomForm';
import { classroomService, occupationService } from '../services/api';
import { ClassRoom } from '../types/ClassRoom';
import { Occupation } from '../types/Occupation';

interface ClassRoomWithOccupation extends ClassRoom {
  currentOccupation?: Occupation;
}

export function Home() {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxStudents, setMaxStudents] = useState<number | ''>('');
  const [hasProjector, setHasProjector] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassRoomWithOccupation[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<ClassRoom | undefined>();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Atualiza a data/hora a cada minuto
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const loadClassrooms = async () => {
    setIsLoading(true);
    setError('');

    try {
      const allClassrooms = await classroomService.findAll();
      console.log('Todas as salas:', allClassrooms);
      
      const currentDate = currentDateTime.toISOString().split('T')[0];
      const currentTime = format(currentDateTime, 'HH:mm');
      console.log('Data e hora atuais:', { currentDate, currentTime });

      const occupiedRooms = await occupationService.getOccupiedRooms(currentDate, currentTime);
      console.log('Salas ocupadas retornadas:', occupiedRooms);
      
      const occupiedRoomIds = new Set(occupiedRooms.map(o => o.roomId));
      console.log('IDs das salas ocupadas:', Array.from(occupiedRoomIds));

      let filteredClassrooms: ClassRoomWithOccupation[] = [];

      if (currentTab === 0) {
        filteredClassrooms = allClassrooms
          .filter(classroom => occupiedRoomIds.has(classroom.id))
          .map(classroom => ({
            ...classroom,
            currentOccupation: occupiedRooms.find(o => o.roomId === classroom.id)
          }));
        console.log('Salas filtradas (ocupadas):', filteredClassrooms);
      } else {
        filteredClassrooms = allClassrooms
          .filter(classroom => !occupiedRoomIds.has(classroom.id))
          .map(classroom => ({ ...classroom }));
        console.log('Salas filtradas (disponíveis):', filteredClassrooms);
      }

      setClassrooms(filteredClassrooms);
      if (filteredClassrooms.length === 0) {
        setError(currentTab === 0 ? 'Nenhuma sala ocupada no momento' : 'Nenhuma sala disponível no momento');
      }
    } catch (err) {
      console.error('Erro ao carregar salas:', err);
      setError('Erro ao carregar as salas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError('');

    try {
      const allClassrooms = await classroomService.findAll();
      
      const currentDate = currentDateTime.toISOString().split('T')[0];
      const currentTime = format(currentDateTime, 'HH:mm');

      const occupiedRooms = await occupationService.getOccupiedRooms(currentDate, currentTime);
      const occupiedRoomIds = new Set(occupiedRooms.map(o => o.roomId));

      let filteredClassrooms: ClassRoomWithOccupation[] = [];

      if (currentTab === 0) {
        filteredClassrooms = allClassrooms
          .filter(classroom => {
            if (!occupiedRoomIds.has(classroom.id)) return false;
            
            const occupation = occupiedRooms.find(o => o.roomId === classroom.id);
            if (!occupation) return false;

            const searchTermLower = searchTerm.toLowerCase();
            return classroom.roomNumber.toString().toLowerCase().includes(searchTermLower) ||
                   occupation.teacher.toLowerCase().includes(searchTermLower) ||
                   occupation.subject.toLowerCase().includes(searchTermLower);
          })
          .map(classroom => ({
            ...classroom,
            currentOccupation: occupiedRooms.find(o => o.roomId === classroom.id)
          }));
      } else {
        filteredClassrooms = allClassrooms
          .filter(classroom => {
            if (occupiedRoomIds.has(classroom.id)) return false;
            
            if (searchTerm && !classroom.roomNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
              return false;
            }

            if (maxStudents && classroom.maxStudents < maxStudents) {
              return false;
            }

            if (hasProjector && !classroom.hasProjector) {
              return false;
            }

            return true;
          })
          .map(classroom => ({ ...classroom }));
      }

      setClassrooms(filteredClassrooms);
      if (filteredClassrooms.length === 0) {
        setError('Nenhuma sala encontrada com os critérios de busca');
      }
    } catch (err) {
      setError('Erro ao buscar salas. Tente novamente.');
      setClassrooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, [currentTab, currentDateTime]);

  const handleOpenForm = (classroom?: ClassRoom) => {
    setSelectedClassroom(classroom);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedClassroom(undefined);
    setIsFormOpen(false);
  };

  const handleDeleteClassroom = async (classroom: ClassRoom) => {
    try {
      await classroomService.remove(classroom.id);
      loadClassrooms();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao deletar sala. Tente novamente.');
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        p: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{
              fontSize: { xs: '1.5rem', sm: '2.125rem' },
              mb: 1
            }}
          >
            Sistema de Gerenciamento de Salas
          </Typography>
          <Chip 
            label={format(currentDateTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            color="primary"
            variant="outlined"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nova Sala
        </Button>
      </Box>

      <Box sx={{ width: '100%' }}>
        <NavigationTabs currentTab={currentTab} onTabChange={setCurrentTab} />

        {currentTab === 0 ? (
          <OccupiedSearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearch}
          />
        ) : (
          <AvailableSearchBar
            searchTerm={searchTerm}
            maxStudents={maxStudents}
            hasProjector={hasProjector}
            onSearchTermChange={setSearchTerm}
            onMaxStudentsChange={setMaxStudents}
            onHasProjectorChange={setHasProjector}
            onSearch={handleSearch}
          />
        )}

        {error && (
          <Typography color="error" align="center" gutterBottom sx={{ width: '100%' }}>
            {error}
          </Typography>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {classrooms.map((classroom) => (
              <Grid item xs={12} sm={6} md={4} key={classroom.id}>
                <ClassroomCard 
                  classroom={classroom}
                  onEdit={handleOpenForm}
                  onDelete={handleDeleteClassroom}
                  onRefresh={loadClassrooms}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ClassroomForm
        open={isFormOpen}
        onClose={handleCloseForm}
        classroom={selectedClassroom}
        onSuccess={loadClassrooms}
      />
    </Container>
  );
} 