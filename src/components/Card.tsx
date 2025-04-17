import { Card as MuiCard, CardContent, Typography } from '@mui/material';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
    return (
        <MuiCard 
            sx={{ 
                py: 4,
                px: 2,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: 'white'
            }}
            className={className}
        >
            <CardContent>
                {title && (
                    <Typography 
                        variant="h4" 
                        component="h2" 
                        sx={{ 
                            mb: 4, 
                            fontWeight: 'bold', 
                            textAlign: 'center',
                            fontSize: '1.875rem'
                        }}
                    >
                        {title}
                    </Typography>
                )}
                {children}
            </CardContent>
        </MuiCard>
    );
} 