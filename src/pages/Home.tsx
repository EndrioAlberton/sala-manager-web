import { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { NavigationTabs } from '../components/NavigationTabs';
import { OccupiedSearchBar } from '../components/OccupiedSearchBar';
import { AvailableSearchBar } from '../components/AvailableSearchBar';
import { ClassroomCard } from '../components/ClassroomCard';
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

  const handleSearch = async () => {
    setIsLoading(true);
    setError('');

    try {
      let data: ClassRoom[] = [];
      
      if (currentTab === 0) {
        // Busca salas ocupadas
        data = await classroomService.searchByFilters({
          searchTerm,
          maxStudents: '',
          hasProjector: false
        });
        data = data.filter(classroom => classroom.isOccupied);
      } else {
        // Busca salas disponíveis
        data = await classroomService.searchByFilters({
          searchTerm,
          maxStudents,
          hasProjector
        });
        data = data.filter(classroom => !classroom.isOccupied);
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
    const loadInitialData = async () => {
      try {
        const data = await classroomService.findAll();
        setClassrooms(data.filter(classroom => 
          currentTab === 0 ? classroom.isOccupied : !classroom.isOccupied
        ));
      } catch (err) {
        setError('Erro ao carregar as salas. Tente novamente.');
      }
    };

    loadInitialData();
  }, [currentTab]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Sistema de Gerenciamento de Salas
      </Typography>

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
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {classrooms.map((classroom) => (
            <Grid item xs={12} sm={6} md={4} key={classroom.id}>
              <ClassroomCard classroom={classroom} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
} 