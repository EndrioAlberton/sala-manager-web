import { TextField, Button, Box, Grid } from '@mui/material';

interface OccupiedSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
}

export function OccupiedSearchBar({ searchTerm, onSearchTermChange, onSearch }: OccupiedSearchBarProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={11}>
          <TextField
            fullWidth
            label="Buscar por número da sala, professor ou disciplina"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Ex: 101, João Silva, Matemática"
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