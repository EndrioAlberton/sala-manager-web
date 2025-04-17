import React from 'react';
import { 
  Paper, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Box, 
  Grid, 
  FormControlLabel, 
  Checkbox, 
  Button, 
  Divider 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleClear = () => {
    onSearchTermChange('');
    onMaxStudentsChange('');
    onHasProjectorChange(false);
    onSearch();
  };

  const handleMaxStudentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      onMaxStudentsChange('');
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        onMaxStudentsChange(numValue);
      }
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            placeholder="Buscar pelo número da sala..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => onSearchTermChange('')}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }}>Filtros</Divider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Capacidade mínima"
            placeholder="Nº de alunos"
            type="number"
            value={maxStudents}
            onChange={handleMaxStudentsChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterAltIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={hasProjector}
                  onChange={(e) => onHasProjectorChange(e.target.checked)}
                  color="primary"
                />
              }
              label="Com projetor"
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={handleClear}
              size="small"
            >
              Limpar
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={onSearch}
              size="small"
            >
              Buscar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
} 