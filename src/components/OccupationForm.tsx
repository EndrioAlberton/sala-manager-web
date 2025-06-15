import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { occupationSchema } from '../schemas/occupationSchema';
import { authService } from '../services/authService';
import { disciplineService, Discipline } from '../services/disciplineService';
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

interface OccupationFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
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

export function OccupationForm({ open, onClose, onSubmit, disciplines }: OccupationFormProps) {
    const currentUser = authService.getCurrentUser();
    const isProfessor = currentUser?.userType?.toLowerCase() === 'professor';
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(occupationSchema),
        defaultValues: {
            teacher: currentUser?.email || '',
            disciplina: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            daysOfWeek: []
        }
    });

    useEffect(() => {
        if (!open) return;

        const initialDiscipline = disciplines[0];
        if (!initialDiscipline) return;

        setSelectedDays([]);
        setSelectedDiscipline(initialDiscipline);

        reset({
            teacher: currentUser?.email || '',
            disciplina: initialDiscipline.baseDiscipline.name,
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
            setValue('disciplina', discipline.baseDiscipline.name);
        }
    };

    const handleFormSubmit = (data: any) => {
        const formData = {
            ...data,
            teacher: currentUser?.email,
            disciplina: selectedDiscipline?.baseDiscipline.name || '',
            subject: selectedDiscipline?.baseDiscipline.name,
            daysOfWeek: selectedDays
        };

        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Ocupar Sala</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                                            {discipline.baseDiscipline.name}
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button 
                        type="submit" 
                        variant="contained"
                    >
                        Ocupar ({selectedDays.length} {selectedDays.length === 1 ? 'dia' : 'dias'})
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
