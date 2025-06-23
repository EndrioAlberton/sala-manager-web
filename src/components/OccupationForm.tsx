import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { occupationSchema } from '../schemas/occupationSchema';
import { authService } from '../services/authService';
import { disciplineService, Discipline } from '../services/disciplineService';
import { occupationService } from '../services/api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    FormLabel,
    Stack,
} from '@mui/material';

interface User {
    email: string;
    userType?: string;
}

interface OccupationFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    currentUser: User | null;
    selectedRoom: number;
    disciplines: Discipline[];
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

export function OccupationForm({ open, onClose, onSubmit, currentUser, selectedRoom, disciplines }: OccupationFormProps) {
    const isProfessor = currentUser?.userType?.toLowerCase() === 'professor';
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    const {
        register,
        handleSubmit: formHandleSubmit,
        formState: { errors },
        setValue,
        reset,
        setError: formSetError,
    } = useForm({
        resolver: zodResolver(occupationSchema),
    });

    useEffect(() => {
        if (!open) return;

        const initialDiscipline = disciplines[0];
        if (!initialDiscipline) return;

        setSelectedDays([]);
        setSelectedDiscipline(initialDiscipline);

        reset({
            teacher: currentUser?.email || '',
            disciplina: initialDiscipline.baseDiscipline?.name || '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            daysOfWeek: []
        });
    }, [open]);

    const handleDayClick = (dayValue: number) => {
        setSelectedDays(prevDays => {
            const newDays = prevDays.includes(dayValue)
                ? prevDays.filter(d => d !== dayValue)
                : [...prevDays, dayValue].sort((a, b) => a - b);
            
            setValue('daysOfWeek', newDays);
            return newDays;
        });
    };

    const handleDisciplineChange = (event: any) => {
        const disciplineId = event.target.value;
        const discipline = disciplines.find(d => d.id.toString() === disciplineId);
        if (discipline) {
            setSelectedDiscipline(discipline);
            setValue('disciplina', discipline.baseDiscipline?.name || '');
        }
    };

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Captura os valores dos campos do formulário
        const formData = new FormData(e.currentTarget);
        const formValues = {
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            startTime: formData.get('startTime') as string,
            endTime: formData.get('endTime') as string,
        };

        try {
            console.log('=== FRONTEND: ENVIANDO DADOS PARA HANDLEOCCUPY ===');
            console.log('Dados do formulário:', {
                teacher: currentUser?.email,
                subject: selectedDiscipline?.baseDiscipline?.name || '',
                startDate: formValues.startDate,
                endDate: formValues.endDate,
                startTime: formValues.startTime,
                endTime: formValues.endTime,
                daysOfWeek: selectedDays
            });

            // Apenas passa os dados para o ClassroomCard.handleOccupy()
            // Não cria a ocupação aqui
            onSubmit({
                teacher: currentUser?.email || '',
                subject: selectedDiscipline?.baseDiscipline?.name || '',
                startDate: formValues.startDate,
                endDate: formValues.endDate,
                startTime: formValues.startTime,
                endTime: formValues.endTime,
                daysOfWeek: selectedDays
            });

            console.log('=== FRONTEND: DADOS ENVIADOS ===');
            onClose();
        } catch (err) {
            console.error('=== FRONTEND: ERRO NO FORMULÁRIO ===');
            console.error('Erro detalhado:', err);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro no formulário');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Ocupar Sala</DialogTitle>
            <form onSubmit={onFormSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <input
                            type="hidden"
                            {...register('teacher')}
                            value={currentUser?.email || ''}
                        />

                        {isProfessor ? (
                            <FormControl fullWidth error={!!errors.disciplina}>
                                <InputLabel>Disciplina</InputLabel>
                                <Select
                                    value={selectedDiscipline?.id.toString() || ''}
                                    onChange={handleDisciplineChange}
                                    label="Disciplina"
                                >
                                    {disciplines.map((discipline) => (
                                        <MenuItem key={discipline.id} value={discipline.id.toString()}>
                                            {discipline.baseDiscipline?.name || 'Disciplina sem nome'}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.disciplina && (
                                    <FormHelperText>{errors.disciplina.message as string}</FormHelperText>
                                )}
                            </FormControl>
                        ) : (
                            <TextField
                                {...register('disciplina')}
                                label="Disciplina"
                                fullWidth
                                error={!!errors.disciplina}
                                helperText={errors.disciplina?.message as string}
                            />
                        )}

                        <TextField
                            {...register('startDate')}
                            label="Data Inicial"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message as string}
                        />

                        <TextField
                            {...register('endDate')}
                            label="Data Final"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message as string}
                        />

                        <TextField
                            {...register('startTime')}
                            label="Horário Inicial"
                            type="time"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.startTime}
                            helperText={errors.startTime?.message as string}
                        />

                        <TextField
                            {...register('endTime')}
                            label="Horário Final"
                            type="time"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.endTime}
                            helperText={errors.endTime?.message as string}
                        />

                        <FormControl error={!!errors.daysOfWeek} component="fieldset">
                            <FormLabel component="legend">Dias da Semana</FormLabel>
                            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                                {DAYS_OF_WEEK.map((day) => {
                                    const isSelected = selectedDays.includes(day.value);
                                    return (
                                        <Button
                                            key={day.value}
                                            variant={isSelected ? "contained" : "outlined"}
                                            onClick={() => handleDayClick(day.value)}
                                            sx={{
                                                minWidth: '100px',
                                                textTransform: 'none'
                                            }}
                                        >
                                            {day.label}
                                        </Button>
                                    );
                                })}
                            </Stack>
                            {errors.daysOfWeek && (
                                <FormHelperText error>{errors.daysOfWeek.message as string}</FormHelperText>
                            )}
                            {selectedDays.length > 0 && (
                                <FormHelperText>
                                    Dias selecionados: {selectedDays.map(day => DAYS_OF_WEEK[day].label).join(', ')}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {error && (
                            <Box sx={{ color: 'error.main', mt: 2 }}>
                                {error}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Aguarde...' : 'Ocupar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default OccupationForm;
