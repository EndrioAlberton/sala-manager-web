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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserType } from '../types/User';

const profileSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z.string()
        .min(1, 'Email é obrigatório')
        .email('Formato de email inválido')
});

const baseDisciplineSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    code: z.string()
        .min(3, 'Código deve ter no mínimo 3 caracteres')
        .max(10, 'Código deve ter no máximo 10 caracteres'),
    description: z.string()
        .min(10, 'Descrição deve ter no mínimo 10 caracteres')
        .max(500, 'Descrição deve ter no máximo 500 caracteres'),
    area: z.string()
        .min(3, 'Área deve ter no mínimo 3 caracteres')
        .max(50, 'Área deve ter no máximo 50 caracteres')
});

export function UserProfile() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [baseDisciplines, setBaseDisciplines] = useState<BaseDiscipline[]>([]);
    const [selectedDiscipline, setSelectedDiscipline] = useState<number>(0);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isBaseDisciplineDialogOpen, setIsBaseDisciplineDialogOpen] = useState(false);
    const isAdmin = authService.isAdmin();

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue,
        formState: { errors: profileErrors }
    } = useForm({
        resolver: zodResolver(profileSchema),
        mode: 'onChange'
    });

    const {
        register: registerBaseDiscipline,
        handleSubmit: handleSubmitBaseDiscipline,
        formState: { errors: baseDisciplineErrors },
        reset: resetBaseDisciplineForm
    } = useForm({
        resolver: zodResolver(baseDisciplineSchema),
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

            if (authService.isProfessor()) {
                loadDisciplines(user.id);
            }
        }
    }, [navigate, setValue]);

    // Efeito para carregar disciplinas base quando as disciplinas do professor mudarem
    useEffect(() => {
        if (authService.isProfessor()) {
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

    const handleCreateBaseDiscipline = async (data: any) => {
        try {
            setLoading(true);
            setError('');
            await disciplineService.createBaseDiscipline(data);
            setIsBaseDisciplineDialogOpen(false);
            resetBaseDisciplineForm();
            // Atualiza a lista de disciplinas base
            const updatedBaseDisciplines = await disciplineService.getBaseDisciplines();
            setBaseDisciplines(updatedBaseDisciplines);
        } catch (err: any) {
            console.error('Erro ao criar disciplina base:', err);
            setError(err.message || 'Erro ao criar disciplina base');
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

            <Container maxWidth="md">
                <Paper 
                    elevation={2}
                    sx={{ 
                        p: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <form onSubmit={handleSubmitProfile(onSubmit)}>
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
                                error={!!profileErrors.name}
                                helperText={profileErrors.name?.message as string}
                                {...registerProfile('name')}
                                variant="outlined"
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                error={!!profileErrors.email}
                                helperText={profileErrors.email?.message as string}
                                {...registerProfile('email')}
                                variant="outlined"
                            />

                            {authService.isProfessor() && (
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

                            {isAdmin && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Gerenciar Disciplinas Base
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setIsBaseDisciplineDialogOpen(true)}
                                        sx={{ alignSelf: 'flex-start' }}
                                    >
                                        Nova Disciplina Base
                                    </Button>
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

            {/* Dialog para criar nova disciplina base */}
            <Dialog 
                open={isBaseDisciplineDialogOpen} 
                onClose={() => setIsBaseDisciplineDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Nova Disciplina Base</DialogTitle>
                <form onSubmit={handleSubmitBaseDiscipline(handleCreateBaseDiscipline)}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <TextField
                                fullWidth
                                label="Nome da Disciplina"
                                error={!!baseDisciplineErrors.name}
                                helperText={baseDisciplineErrors.name?.message as string}
                                {...registerBaseDiscipline('name')}
                            />
                            
                            <TextField
                                fullWidth
                                label="Código"
                                error={!!baseDisciplineErrors.code}
                                helperText={baseDisciplineErrors.code?.message as string}
                                {...registerBaseDiscipline('code')}
                            />
                            
                            <TextField
                                fullWidth
                                label="Descrição"
                                multiline
                                rows={3}
                                error={!!baseDisciplineErrors.description}
                                helperText={baseDisciplineErrors.description?.message as string}
                                {...registerBaseDiscipline('description')}
                            />
                            
                            <TextField
                                fullWidth
                                label="Área"
                                error={!!baseDisciplineErrors.area}
                                helperText={baseDisciplineErrors.area?.message as string}
                                {...registerBaseDiscipline('area')}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setIsBaseDisciplineDialogOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Criando...' : 'Criar Disciplina'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
} 