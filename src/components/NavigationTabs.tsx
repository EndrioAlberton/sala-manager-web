import { Tabs, Tab, Box } from '@mui/material';

interface NavigationTabsProps {
  currentTab: number;
  onTabChange: (newValue: number) => void;
}

export function NavigationTabs({ currentTab, onTabChange }: NavigationTabsProps) {
  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'divider', 
      mb: 3,
      width: '100%',
      overflowX: 'auto'
    }}>
      <Tabs 
        value={currentTab} 
        onChange={(_, newValue) => onTabChange(newValue)}
        variant="fullWidth"
        sx={{
          minHeight: {
            xs: 'auto',
            sm: '48px'
          }
        }}
      >
        <Tab label="Salas Ocupadas" sx={{ minWidth: { xs: '50%', sm: 'auto' } }} />
        <Tab label="Salas Disponíveis" sx={{ minWidth: { xs: '50%', sm: 'auto' } }} />
      </Tabs>
    </Box>
  );
} 