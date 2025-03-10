import { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NavigationTabs } from '../components/NavigationTabs';
import { OccupiedSearchBar } from '../components/OccupiedSearchBar';
import { AvailableSearchBar } from '../components/AvailableSearchBar';
import { ClassroomCard } from '../components/ClassroomCard';
import { ClassroomForm } from '../components/ClassroomForm';
import { classroomService } from '../services/api';
import { ClassRoom } from '../types/ClassRoom';

export function Home() {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxStudents, setMaxStudents] = useState<number | ''>('');
  const [hasProjector, setHasProjector] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<ClassRoom | undefined>();

  const loadClassrooms = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await classroomService.findAll();
      setClassrooms(data.filter(classroom => 
        currentTab === 0 ? classroom.isOccupied : !classroom.isOccupied
      ));
    } catch (err) {
      setError('Erro ao carregar as salas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError('');

    try {
      let data: ClassRoom[] = [];
      
      if (currentTab === 0) {
        data = await classroomService.findAll();
        data = data.filter(classroom => classroom.isOccupied && (
          !searchTerm || 
          classroom.roomNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          classroom.currentTeacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classroom.currentSubject?.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } else {
        data = await classroomService.findAll();
        
        data = data.filter(classroom => {
          if (classroom.isOccupied) return false;

          if (searchTerm && !classroom.roomNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }

          if (maxStudents && classroom.maxStudents < maxStudents) {
            return false;
          }

          if (hasProjector && !(classroom as any).hasProjector) {
            return false;
          }

          return true;
        });
      }

      setClassrooms(data);
      if (data.length === 0) {
        setError('Nenhuma sala encontrada com os critérios de busca');
      }
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Erro ao buscar salas. Tente novamente.');
      setClassrooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, [currentTab]);

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
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{
            fontSize: { xs: '1.5rem', sm: '2.125rem' },
          }}
        >
          Sistema de Gerenciamento de Salas
        </Typography>
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