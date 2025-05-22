import React from 'react';
import { TextField, FormControl, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'error' | 'label'> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <FormControl fullWidth variant="outlined" margin="normal" error={!!error}>
            <TextField
                variant="outlined"
                label={label}
                error={!!error}
                helperText={error || ' '}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: error ? 'error.main' : 'primary.main',
                        },
                    },
                    mb: 0,
                    '& .MuiFormHelperText-root': {
                        minHeight: '1.25rem',
                        m: 0,
                        mt: 0.5
                    }
                }}
                className={className}
                {...props as any}
            />
        </FormControl>
    );
}; 