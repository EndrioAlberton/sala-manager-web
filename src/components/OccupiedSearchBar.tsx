import React from 'react';
import { Paper, TextField, InputAdornment, IconButton, Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface OccupiedSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
}

export function OccupiedSearchBar({ 
  searchTerm, 
  onSearchTermChange, 
  onSearch 
}: OccupiedSearchBarProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleClear = () => {
    onSearchTermChange('');
    onSearch();
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
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <TextField
          placeholder="Buscar por número da sala, professor ou disciplina..."
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
                  onClick={handleClear}
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
        <Button 
          variant="contained" 
          color="primary"
          onClick={onSearch}
          size="small"
        >
          Buscar
        </Button>
      </Box>
    </Paper>
  );
} 