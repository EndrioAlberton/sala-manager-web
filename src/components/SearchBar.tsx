import { TextField, Button, Box, FormControlLabel, Checkbox, Grid } from '@mui/material';

interface SearchFilters {
  searchTerm: string;
  maxStudents: number | '';
  hasProjector: boolean;
}

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export function SearchBar({ filters, onFiltersChange, onSearch }: SearchBarProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Buscar"
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
            placeholder="Digite o número da sala, nome do professor ou disciplina"
            helperText="Ex: 101, João Silva, Matemática"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Capacidade Mínima de Alunos"
            value={filters.maxStudents}
            onChange={(e) => onFiltersChange({ ...filters, maxStudents: e.target.value ? Number(e.target.value) : '' })}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.hasProjector}
                onChange={(e) => onFiltersChange({ ...filters, hasProjector: e.target.checked })}
              />
            }
            label="Com Projetor"
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button variant="contained" onClick={onSearch} fullWidth>
            Buscar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
} 