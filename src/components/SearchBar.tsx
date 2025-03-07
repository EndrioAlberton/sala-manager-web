import { TextField, Button, Box } from '@mui/material';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchBar({ searchTerm, onSearchTermChange, onSearch }: SearchBarProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
      <TextField
        fullWidth
        label="Número da Sala"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      />
      <Button variant="contained" onClick={onSearch}>
        Buscar
      </Button>
    </Box>
  );
} 