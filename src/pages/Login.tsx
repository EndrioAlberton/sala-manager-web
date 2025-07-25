import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../services/authService';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Link,
  styled
} from '@mui/material';
import { loginSchema, LoginFormData } from '../schemas/userSchema';

// Componente estilizado para o fundo da página
const StyledBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(to bottom right, #e8eaf6, #bbdefb)',
  padding: theme.spacing(2)
}));

// Componente estilizado para o card do formulário
const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  animation: 'fadeIn 0.3s ease-out',
  width: '100%',
  maxWidth: '450px',
  marginTop: theme.spacing(2)
}));

export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        setError('');
        setLoading(true);

        try {
            await authService.login(data);
            navigate('/classrooms', { replace: true });
        } catch (err: any) {
            console.error('Erro durante login:', err);
            setError(err.message || 'Erro de autenticação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledBackground>
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Logo e título */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
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
                </Box>

                <FormCard>
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                            Bem-vindo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Faça login para continuar
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {error && <Alert message={error} />}
                        
                        <Input
                            label="Email"
                            type="email"
                            error={errors.email?.message}
                            {...register('email')}
                            placeholder="Seu e-mail"
                            fullWidth
                        />

                        <Input
                            label="Senha"
                            type="password"
                            error={errors.password?.message}
                            {...register('password')}
                            placeholder="Sua senha"
                            fullWidth
                        />

                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                isLoading={loading}
                                variant="primary"
                                className="full-width-button"
                            >
                                Entrar
                            </Button>
                        </Box>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link 
                                component={RouterLink} 
                                to="/register" 
                                sx={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 500,
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Não tem uma conta? Registre-se
                            </Link>
                        </Box>
                    </form>
                </FormCard>
            </Container>
        </StyledBackground>
    );
}