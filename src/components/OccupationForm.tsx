import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  DialogActions,
  Alert,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
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
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
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

    if (!formData.startTime) {
      newErrors.startTime = 'Horário inicial é obrigatório';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Horário final é obrigatório';
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            <DatePicker
              label="Data Inicial"
              value={formData.startDate ? new Date(formData.startDate) : null}
              onChange={(date: Date | null) => setFormData({ 
                ...formData, 
                startDate: date?.toISOString() 
              })}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  error: !!errors.startDate,
                  helperText: errors.startDate
                }
              }}
            />
            <DatePicker
              label="Data Final"
              value={formData.endDate ? new Date(formData.endDate) : null}
              onChange={(date: Date | null) => setFormData({ 
                ...formData, 
                endDate: date?.toISOString() 
              })}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  error: !!errors.endDate,
                  helperText: errors.endDate
                }
              }}
            />
            <TimePicker
              label="Horário Inicial"
              value={formData.startTime ? new Date(`1970-01-01T${formData.startTime}`) : null}
              onChange={(time: Date | null) => setFormData({ 
                ...formData, 
                startTime: time ? format(time, 'HH:mm') : undefined
              })}
              ampm={false}
              slotProps={{
                textField: {
                  error: !!errors.startTime,
                  helperText: errors.startTime
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
                  helperText: errors.endTime
                }
              }}
            />
            <FormGroup>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Dias da Semana
              </Typography>
              {DAYS_OF_WEEK.map(day => (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={formData.daysOfWeek?.includes(day.value)}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [...(formData.daysOfWeek || []), day.value]
                          : formData.daysOfWeek?.filter(d => d !== day.value);
                        setFormData({ ...formData, daysOfWeek: newDays });
                      }}
                    />
                  }
                  label={day.label}
                />
              ))}
              {errors.daysOfWeek && (
                <Typography color="error" variant="caption">
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