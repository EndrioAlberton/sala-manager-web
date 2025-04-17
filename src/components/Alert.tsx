import { Alert as MuiAlert, AlertProps as MuiAlertProps } from '@mui/material';

interface AlertProps {
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
    className?: string;
}

export function Alert({ message, type = 'error', className = '' }: AlertProps) {
    // Mapear o tipo para a severidade do MUI Alert
    const getSeverity = (): MuiAlertProps['severity'] => {
        switch (type) {
            case 'error': return 'error';
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'error';
        }
    };

    return (
        <MuiAlert 
            severity={getSeverity()} 
            variant="outlined"
            className={className}
            sx={{ mb: 2 }}
        >
            {message}
        </MuiAlert>
    );
} 