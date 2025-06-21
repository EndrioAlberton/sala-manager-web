import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Box, 
  Button, 
  Chip, 
  Paper,
  styled
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { authService } from '../services/authService';
import { classroomService, occupationService } from '../services/api';
import { ClassRoom } from '../types/ClassRoom';
import { Occupation } from '../types/Occupation';
import { ClassroomCard } from '../components/ClassroomCard';
import { ClassroomForm } from '../components/ClassroomForm';
import { classroomObserver } from '../services/classroomObserver';

// Componentes que precisamos criar
import { NavigationTabs } from '../components/NavigationTabs';
import { OccupiedSearchBar } from '../components/OccupiedSearchBar';
import { AvailableSearchBar } from '../components/AvailableSearchBar';

// Componente estilizado para o fundo da página (similar ao Login/Register)
const StyledBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(to bottom right, #e8eaf6, #bbdefb)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column'
}));

// Componente estilizado para o conteúdo principal
const ContentWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  animation: 'fadeIn 0.3s ease-out',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column'
}));

interface ClassRoomWithOccupation extends ClassRoom {
  currentOccupation?: Occupation;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxStudents, setMaxStudents] = useState<number | ''>('');
  const [hasProjector, setHasProjector] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassRoomWithOccupation[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<ClassRoom | undefined>();
  const [currentDateTime] = useState(new Date());
  const isAdmin = authService.isAdmin();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Função para carregar todas as salas
  const loadClassrooms = async () => {
    // Se um modal estiver aberto, não atualiza
    if (isFormOpen) return;

    setIsLoading(true);
    setError('');

    try {
      // Buscar todas as salas
      const allClassrooms = await classroomService.findAll();
      
      // Verificar quais salas estão ocupadas no momento
      const currentDate = currentDateTime.toISOString().split('T')[0];
      const currentTime = format(currentDateTime, 'HH:mm');

      const occupiedRooms = await occupationService.getOccupiedRooms(currentDate, currentTime);
      const occupiedRoomIds = new Set(occupiedRooms.map(o => o.roomId));

      // Filtrar salas conforme a tab selecionada
      let filteredClassrooms: ClassRoomWithOccupation[] = [];
      
      if (currentTab === 0) { // Salas ocupadas
        // Filtrar apenas salas ocupadas
        filteredClassrooms = allClassrooms
          .filter(classroom => occupiedRoomIds.has(classroom.id))
          .map(classroom => ({
            ...classroom,
            currentOccupation: occupiedRooms.find(o => o.roomId === classroom.id)
          }));
      } else { // Salas disponíveis
        // Filtrar apenas salas disponíveis
        filteredClassrooms = allClassrooms
          .filter(classroom => !occupiedRoomIds.has(classroom.id))
          .map(classroom => ({ ...classroom }));
      }

      setClassrooms(filteredClassrooms);
      if (filteredClassrooms.length === 0) {
        setError(`Nenhuma sala ${currentTab === 0 ? 'ocupada' : 'disponível'} encontrada.`);
      }
    } catch (err) {
      setError('Erro ao carregar salas. Tente novamente.');
      setClassrooms([]);
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
  }, [currentTab]);

  // Adiciona o observer quando o componente monta
  useEffect(() => {
    const unsubscribe = classroomObserver.subscribe(() => {
      // Só atualiza se não houver modal aberto
      if (!isFormOpen) {
        loadClassrooms();
      }
    });

    // Cleanup quando o componente desmonta
    return () => unsubscribe();
  }, [isFormOpen]); // Adiciona isFormOpen como dependência

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
    <StyledBackground>
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
            Sala Manager
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Sistema de Gerenciamento de Salas
          </Typography>
        </Box>
        
        <ContentWrapper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, '@media (max-width: 600px)': { flexDirection: 'column', alignItems: 'flex-start', },}}>
            <Chip 
              label={format(currentDateTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              color="primary"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: { xs: '100%', sm: 'auto' }}}>
              {isAdmin && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenForm()}
                  size="small"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white', 
                  }}
                >
                  Nova Sala
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/profile')}
                size="small"
              >
                Meu Perfil
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                size="small"
              >
                Sair
              </Button>
            </Box>
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
              <Typography color="error" align="center" gutterBottom sx={{ width: '100%', my: 3 }}>
                {error}
              </Typography>
            )}

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mt: 1 }}>
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
        </ContentWrapper>
      </Container>
    </StyledBackground>
  );
}