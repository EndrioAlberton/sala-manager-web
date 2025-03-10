import React from 'react';
import { TextField, Button, Box, FormControlLabel, Checkbox, Grid } from '@mui/material';

interface AvailableSearchBarProps {
  searchTerm: string;
  maxStudents: number | '';
  hasProjector: boolean;
  onSearchTermChange: (value: string) => void;
  onMaxStudentsChange: (value: number | '') => void;
  onHasProjectorChange: (value: boolean) => void;
  onSearch: () => void;
}

export function AvailableSearchBar({
  searchTerm,
  maxStudents,
  hasProjector,
  onSearchTermChange,
  onMaxStudentsChange,
  onHasProjectorChange,
  onSearch
}: AvailableSearchBarProps) {
  return (
    <Box sx={{ mb: 3, mx: 0 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Número da Sala"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Ex: 101"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Capacidade Mínima de Alunos"
            value={maxStudents}
            onChange={(e) => onMaxStudentsChange(e.target.value ? Number(e.target.value) : '')}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasProjector}
                onChange={(e) => onHasProjectorChange(e.target.checked)}
              />
            }
            label="Com Projetor"
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button 
            variant="contained" 
            onClick={onSearch} 
            fullWidth
          >
            Buscar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
} 