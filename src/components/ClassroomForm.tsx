import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  Checkbox, 
  FormControlLabel,
  Alert 
} from '@mui/material';
import { classroomSchema, ClassroomFormData } from '../schemas/classroomSchema';
import { ClassRoom } from '../types/ClassRoom';
import { classroomService } from '../services/api';

interface ClassroomFormProps {
  open: boolean;
  onClose: () => void;
  classroom?: ClassRoom;
  onSuccess: () => void;
}

export function ClassroomForm({ open, onClose, classroom, onSuccess }: ClassroomFormProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      roomNumber: '',
      floor: 0,
      building: '',
      desks: 1,
      chairs: 1,
      computers: 0,
      hasProjector: false, 
      maxStudents: 1
    }
  });

  useEffect(() => {
    if (classroom) {
      setValue('roomNumber', classroom.roomNumber);
      setValue('floor', classroom.floor);
      setValue('building', classroom.building);
      setValue('desks', classroom.desks);
      setValue('chairs', classroom.chairs);
      setValue('computers', classroom.computers || 0);
      setValue('hasProjector', classroom.hasProjector ? true : false);
      setValue('maxStudents', classroom.maxStudents);
    } else {
      reset();
    }
  }, [classroom, setValue, reset]);

  const onSubmit = async (data: ClassroomFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const formattedData = {
        ...data,
        hasProjector: data.hasProjector === true,
      };

      if (classroom) {
        await classroomService.update(classroom.id, formattedData);
      } else {
        await classroomService.create(formattedData);
      }
      onSuccess();
      onClose();
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar sala. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {classroom ? 'Editar Sala' : 'Nova Sala'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número da Sala"
                {...register('roomNumber')}
                error={!!errors.roomNumber}
                helperText={errors.roomNumber?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Andar"
                {...register('floor', { valueAsNumber: true })}
                error={!!errors.floor}
                helperText={errors.floor?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prédio"
                {...register('building')}
                error={!!errors.building}
                helperText={errors.building?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Número de Mesas"
                {...register('desks', { valueAsNumber: true })}
                error={!!errors.desks}
                helperText={errors.desks?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Número de Cadeiras"
                {...register('chairs', { valueAsNumber: true })}
                error={!!errors.chairs}
                helperText={errors.chairs?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Número de Computadores"
                {...register('computers', { valueAsNumber: true })}
                error={!!errors.computers}
                helperText={errors.computers?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('hasProjector')}
                    onChange={(e) => setValue('hasProjector', e.target.checked)}
                    color="primary"
                  />
                }
                label="Possui Projetor?"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Capacidade Máxima de Alunos"
                {...register('maxStudents', { valueAsNumber: true })}
                error={!!errors.maxStudents}
                helperText={errors.maxStudents?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
