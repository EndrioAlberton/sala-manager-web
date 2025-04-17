import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  styled 
} from '@mui/material';
import { authService } from '../services/authService';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Table } from '../components/Table';

// Componente estilizado para o fundo da página
const StyledBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(to bottom right, #f8f9fa, #e6f2ff)',
  paddingBottom: theme.spacing(8)
}));

// Componente estilizado para os cards com estatísticas
const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

export function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('classrooms');

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <StyledBackground>
            <Header onLogout={handleLogout} />
            
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Título e subtítulo */}
                <Box sx={{ mb: 4, animation: 'fadeIn 0.3s ease-out' }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Gerenciamento de Salas
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Visualize e gerencie as salas disponíveis
                    </Typography>
                </Box>

                {/* Grid de estatísticas */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <StatsCard>
                            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                                Salas Disponíveis
                            </Typography>
                            <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                12
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Salas livres no momento
                            </Typography>
                        </StatsCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StatsCard>
                            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                                Ocupações Hoje
                            </Typography>
                            <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                8
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Salas ocupadas hoje
                            </Typography>
                        </StatsCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StatsCard>
                            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                                Próximas Reservas
                            </Typography>
                            <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                5
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Reservas para amanhã
                            </Typography>
                        </StatsCard>
                    </Grid>
                </Grid>

                {/* Tabela de salas */}
                <Paper 
                    sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        boxShadow: 1,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                        Lista de Salas
                    </Typography>
                    <Table
                        columns={[
                            { key: 'name', label: 'Nome' },
                            { key: 'capacity', label: 'Capacidade' },
                            { key: 'type', label: 'Tipo' },
                            { key: 'status', label: 'Status' }
                        ]}
                        data={[]}
                    />
                </Paper>
            </Container>
        </StyledBackground>
    );
}