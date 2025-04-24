import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Box, 
  Container,
  Divider
} from '@mui/material';
import { authService } from '../services/authService';

interface HeaderProps {
    onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const currentUser = authService.getCurrentUser();
    
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleCloseMenu = () => {
      setAnchorEl(null);
    };
    
    const handleProfile = () => {
        navigate('/profile');
        handleCloseMenu();
    };
    
    const handleLogout = () => {
        onLogout();
        handleCloseMenu();
    };

    if (!currentUser) {
        return null;
    }

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Logo/Título */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ 
                            fontWeight: 'bold',
                            color: 'text.primary'
                        }}
                    >
                        Sala Manager
                    </Typography>
                    
                    {/* Perfil do usuário */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            onClick={handleOpenMenu}
                            sx={{ p: 0, mr: 1 }}
                            aria-controls="user-menu"
                            aria-haspopup="true"
                        >
                            <Avatar 
                                sx={{ 
                                    bgcolor: 'primary.main',
                                    width: 32,
                                    height: 32,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {currentUser?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {currentUser.name}
                        </Typography>
                        
                        <Menu
                            id="user-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                            PaperProps={{
                                elevation: 2,
                                sx: { minWidth: 200 }
                            }}
                        >
                            <MenuItem onClick={handleProfile}>
                                Meu Perfil
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                Sair
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
} 