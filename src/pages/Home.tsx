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
        data = await classroomService.findAll();
        data = data.filter(classroom => classroom.isOccupied && (
          !searchTerm || 
          classroom.roomNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          classroom.currentTeacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classroom.currentSubject?.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } else {
        // Busca salas disponíveis
        data = await classroomService.findAll();
        
        data = data.filter(classroom => {
          // Primeiro verifica se está disponível
          if (classroom.isOccupied) return false;

          // Filtro de busca por número da sala
          if (searchTerm && !classroom.roomNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }

          // Filtro de capacidade mínima
          if (maxStudents && classroom.maxStudents < maxStudents) {
            return false;
          }

          // Filtro de projetor 
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
    <Container 
      maxWidth="lg" 
      sx={{ 
        p: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{
          fontSize: { xs: '1.5rem', sm: '2.125rem' },
          mb: 3,
          width: '100%'
        }}
      >
        Sistema de Gerenciamento de Salas
      </Typography>

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

        <Grid 
          container 
          spacing={3}
        >
          {classrooms.map((classroom) => (
            <Grid item xs={12} sm={6} md={4}>
              <ClassroomCard classroom={classroom} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
} 