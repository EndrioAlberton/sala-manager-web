import { Button as MuiButton, CircularProgress } from '@mui/material';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

export function Button({ 
    children, 
    variant = 'primary', 
    isLoading = false,
    className = '',
    ...props 
}: ButtonProps) {
    // Mapeando os variantes personalizados para os variantes do MUI
    const getVariant = () => {
        switch (variant) {
            case 'primary': return 'contained';
            case 'secondary': return 'outlined';
            case 'danger': return 'contained';
            default: return 'contained';
        }
    };

    // Mapeando as cores com base nos variantes
    const getColor = () => {
        switch (variant) {
            case 'primary': return 'primary';
            case 'secondary': return 'default';
            case 'danger': return 'error';
            default: return 'primary';
        }
    };

    return (
        <MuiButton
            variant={getVariant() as any}
            color={getColor() as any}
            disabled={isLoading || props.disabled}
            className={className}
            {...props}
            sx={{
                textTransform: 'none',
                minHeight: '40px',
                py: 1,
                px: 2
            }}
        >
            {isLoading ? (
                <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Carregando...
                </>
            ) : children}
        </MuiButton>
    );
} 