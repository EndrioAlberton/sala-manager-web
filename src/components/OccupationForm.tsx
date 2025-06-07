import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  FormControl,
  FormGroup,
  Button,
  DialogActions,
  Alert,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { authService } from '../services/authService';

interface OccupationFormData {
  teacher: string;
  subject: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}

interface OccupationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OccupationFormData) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
];

export function OccupationForm({ open, onClose, onSubmit }: OccupationFormProps) {
  const currentUser = authService.getCurrentUser();
  const [formData, setFormData] = useState<Partial<OccupationFormData>>({
    daysOfWeek: [],
    teacher: currentUser?.name || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const user = authService.getCurrentUser();
      setFormData(prev => ({
        ...prev,
        teacher: user?.name || ''
      }));
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.teacher?.trim()) {
      newErrors.teacher = 'Professor é obrigatório';
    }

    if (!formData.subject?.trim()) {
      newErrors.subject = 'Disciplina é obrigatória';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data inicial é obrigatória';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Data final é obrigatória';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.startDate = 'Data inicial deve ser anterior à data final';
      newErrors.endDate = 'Data final deve ser posterior à data inicial';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Horário inicial é obrigatório';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Horário final é obrigatório';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.startTime = 'Horário inicial deve ser anterior ao horário final';
      newErrors.endTime = 'Horário final deve ser posterior ao horário inicial';
    }

    if (!formData.daysOfWeek?.length) {
      newErrors.daysOfWeek = 'Selecione pelo menos um dia da semana';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData as OccupationFormData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ 
      daysOfWeek: [],
      teacher: currentUser?.name || ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ocupar Sala</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <FormControl fullWidth sx={{ gap: 2, mt: 2 }}>
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Por favor, corrija os erros antes de continuar.
              </Alert>
            )}
            
            <TextField
              label="Professor"
              value={formData.teacher || ''}
              disabled
              InputProps={{
                readOnly: true,
              }}
              helperText="Professor atual logado no sistema"
            />
            
            <TextField
              label="Disciplina"
              value={formData.subject || ''}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              error={!!errors.subject}
              helperText={errors.subject}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Data Inicial"
                value={formData.startDate ? new Date(formData.startDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    date.setHours(0, 0, 0, 0);
                    setFormData({ 
                      ...formData, 
                      startDate: date.toISOString(),
                      endDate: (!formData.endDate || new Date(formData.endDate) < date) 
                        ? date.toISOString() 
                        : formData.endDate
                    });
                  }
                }}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                    fullWidth: true
                  }
                }}
              />
              
              <DatePicker
                label="Data Final"
                value={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    date.setHours(0, 0, 0, 0);
                    setFormData({ 
                      ...formData, 
                      endDate: date.toISOString() 
                    });
                  }
                }}
                format="dd/MM/yyyy"
                minDate={formData.startDate ? new Date(formData.startDate) : undefined}
                slotProps={{
                  textField: {
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                    fullWidth: true
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TimePicker
                label="Horário Inicial"
                value={formData.startTime ? new Date(`1970-01-01T${formData.startTime}`) : null}
                onChange={(time: Date | null) => {
                  setFormData({ 
                    ...formData, 
                    startTime: time ? format(time, 'HH:mm') : undefined,
                    endTime: !formData.endTime ? (time ? format(time, 'HH:mm') : undefined) : formData.endTime
                  });
                }}
                ampm={false}
                slotProps={{
                  textField: {
                    error: !!errors.startTime,
                    helperText: errors.startTime,
                    fullWidth: true
                  }
                }}
              />
              
              <TimePicker
                label="Horário Final"
                value={formData.endTime ? new Date(`1970-01-01T${formData.endTime}`) : null}
                onChange={(time: Date | null) => setFormData({ 
                  ...formData, 
                  endTime: time ? format(time, 'HH:mm') : undefined
                })}
                ampm={false}
                slotProps={{
                  textField: {
                    error: !!errors.endTime,
                    helperText: errors.endTime,
                    fullWidth: true
                  }
                }}
              />
            </Box>
            
            <FormGroup>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Dias da Semana
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {DAYS_OF_WEEK.map(day => (
                  <Chip
                    key={day.value}
                    label={day.label}
                    onClick={() => {
                      const newDays = formData.daysOfWeek?.includes(day.value)
                        ? formData.daysOfWeek.filter(d => d !== day.value)
                        : [...(formData.daysOfWeek || []), day.value];
                      setFormData({ ...formData, daysOfWeek: newDays });
                    }}
                    color={formData.daysOfWeek?.includes(day.value) ? "primary" : "default"}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
              {errors.daysOfWeek && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.daysOfWeek}
                </Typography>
              )}
            </FormGroup>
          </FormControl>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Ocupar</Button>
      </DialogActions>
    </Dialog>
  );
} 