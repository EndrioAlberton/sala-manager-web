import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { disciplineService, BaseDiscipline, Discipline } from '../services/disciplineService';
import { User } from '../services/api';
import { z } from 'zod';
import { 
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const profileSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z.string()
        .min(1, 'Email é obrigatório')
        .email('Formato de email inválido')
});

export function UserProfile() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [baseDisciplines, setBaseDisciplines] = useState<BaseDiscipline[]>([]);
    const [selectedDiscipline, setSelectedDiscipline] = useState<number>(0);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(profileSchema),
        mode: 'onChange'
    });

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setValue('name', user.name);
            setValue('email', user.email);

            if (user.userType && user.userType.toUpperCase() === 'PROFESSOR') {
                loadDisciplines(user.id);
            }
        }
    }, [navigate, setValue]);

    // Efeito para carregar disciplinas base quando as disciplinas do professor mudarem
    useEffect(() => {
        if (currentUser?.userType?.toUpperCase() === 'PROFESSOR') {
            loadBaseDisciplines();
        }
    }, [disciplines]);

    const loadDisciplines = async (professorId: number) => {
        try {
            const data = await disciplineService.getProfessorDisciplines(professorId);
            setDisciplines(data);
        } catch (err: any) {
            console.error('Erro ao carregar disciplinas:', err);
            setError(err.message || 'Erro ao carregar disciplinas');
        }
    };

    const loadBaseDisciplines = async () => {
        try {
            const data = await disciplineService.getBaseDisciplines();
            // Filtra as disciplinas que o professor já tem
            const availableDisciplines = data.filter(baseDiscipline => 
                !disciplines.some(d => d.baseDisciplineId === baseDiscipline.id)
            );
            setBaseDisciplines(availableDisciplines);
        } catch (err: any) {
            console.error('Erro ao carregar disciplinas base:', err);
            setError(err.message || 'Erro ao carregar disciplinas base');
        }
    };

    const handleAddDiscipline = async () => {
        if (!selectedDiscipline || !currentUser) return;

        try {
            setLoading(true);
            setError('');
            await disciplineService.addDiscipline(currentUser.id, selectedDiscipline);
            await loadDisciplines(currentUser.id);
            setSelectedDiscipline(0);
        } catch (err: any) {
            console.error('Erro ao adicionar disciplina:', err);
            if (err.message.includes('já possui a disciplina')) {
                setError('Você já possui esta disciplina em seu perfil');
            } else {
                setError(err.message || 'Erro ao adicionar disciplina');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDiscipline = async (disciplineId: number) => {
        if (!currentUser) return;

        try {
            setLoading(true);
            await disciplineService.removeDiscipline(disciplineId);
            await loadDisciplines(currentUser.id);
        } catch (err: any) {
            setError('Erro ao remover disciplina');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setError('');
        setLoading(true);

        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                throw new Error('Usuário não encontrado');
            }

            await userService.updateUser(currentUser.id, data);
            // Atualizar dados do usuário no localStorage
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            navigate('/classrooms');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #e8eaf6, #bbdefb)',
            py: 2,
            px: { xs: 2, sm: 4 }
        }}>
            <Paper 
                elevation={0}
                sx={{ 
                    p: 2, 
                    mb: 3, 
                    textAlign: 'center',
                    bgcolor: 'transparent',
                    boxShadow: 'none'
                }}
            >
                <Typography variant="h3" component="h1" sx={{ 
                    fontWeight: 'bold',
                    color: '#1a237e',
                    mb: 1,
                    fontSize: { xs: '2rem', sm: '3rem' }
                }}>
                    Sala Manager
                </Typography>
                <Typography variant="h6" sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                    Sistema de Gerenciamento de Salas
                </Typography>
            </Paper>

            <Container maxWidth="lg">
                <Paper 
                    elevation={2}
                    sx={{ 
                        p: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ mb: 3 }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Nome"
                                error={!!errors.name}
                                helperText={errors.name?.message as string}
                                {...register('name')}
                                variant="outlined"
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                error={!!errors.email}
                                helperText={errors.email?.message as string}
                                {...register('email')}
                                variant="outlined"
                            />

                            {currentUser?.userType?.toUpperCase() === 'PROFESSOR' && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Minhas Disciplinas
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Adicionar Disciplina</InputLabel>
                                            <Select
                                                value={selectedDiscipline}
                                                onChange={(e) => setSelectedDiscipline(Number(e.target.value))}
                                                label="Adicionar Disciplina"
                                            >
                                                <MenuItem value={0}>Selecione uma disciplina</MenuItem>
                                                {baseDisciplines.map(discipline => (
                                                    <MenuItem key={discipline.id} value={discipline.id}>
                                                        {discipline.name} ({discipline.code})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="contained"
                                            onClick={handleAddDiscipline}
                                            disabled={!selectedDiscipline || loading}
                                        >
                                            Adicionar
                                        </Button>
                                    </Box>

                                    <List>
                                        {disciplines.map(discipline => (
                                            <ListItem key={discipline.id}>
                                                <ListItemText
                                                    primary={discipline.baseDiscipline?.name}
                                                    secondary={`${discipline.baseDiscipline?.code} - ${discipline.baseDiscipline?.area}`}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleRemoveDiscipline(discipline.id)}
                                                        disabled={loading}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </>
                            )}

                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2, 
                                mt: 2,
                                justifyContent: 'flex-end' 
                            }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/classrooms')}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
} 