import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
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
} from '@mui/material';

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

        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setValue('name', currentUser.name);
            setValue('email', currentUser.email);
        }
    }, [navigate, setValue]);

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