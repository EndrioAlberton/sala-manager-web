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
  Stack
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
        p: 1.5, 
        mb: 2, 
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5 }}>
        {/* Campo de busca */}
        <TextField
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
            },
            flexGrow: 1
          }}
        />

        {/* Capacidade mínima */}
        <TextField
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
          sx={{ 
            minWidth: '180px',
            width: { xs: '100%', md: 'auto' }
          }}
        />

        {/* Checkbox projetor */}
        <FormControlLabel
          control={
            <Checkbox 
              checked={hasProjector}
              onChange={(e) => onHasProjectorChange(e.target.checked)}
              color="primary"
              size="small"
            />
          }
          label="Com projetor"
          sx={{ 
            minWidth: '130px',
            m: 0,
            alignItems: 'center'
          }}
        />

        {/* Botões de ação */}
        <Stack direction="row" spacing={1} sx={{ ml: { xs: 0, md: 'auto' } }}>
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
        </Stack>
      </Box>
    </Paper>
  );
} 