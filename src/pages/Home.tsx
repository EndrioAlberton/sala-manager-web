import { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { SearchBar } from '../components/SearchBar';
import { ClassroomCard } from '../components/ClassroomCard';
import { classroomService } from '../services/api';
import { ClassRoom } from '../types/ClassRoom';

export function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor, insira um número de sala');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await classroomService.searchByRoomNumber(searchTerm);
      setClassrooms(data);
      if (data.length === 0) {
        setError('Nenhuma sala encontrada com este número');
      }
    } catch (err) {
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
        setClassrooms(data);
      } catch (err) {
        setError('Erro ao carregar as salas. Tente novamente.');
      }
    };

    loadInitialData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Sistema de Gerenciamento de Salas
      </Typography>

      <SearchBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
      />

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {classrooms.map((classroom) => (
          <Grid item xs={12} sm={6} md={4} key={classroom.id}>
            <ClassroomCard classroom={classroom} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 