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
                helperText={error}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: error ? 'error.main' : 'primary.main',
                        },
                    },
                }}
                className={className}
                {...props as any}
            />
        </FormControl>
    );
}; 