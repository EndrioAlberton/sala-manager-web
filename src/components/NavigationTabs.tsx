import { Tabs, Tab, Box } from '@mui/material';

interface NavigationTabsProps {
  currentTab: number;
  onTabChange: (newValue: number) => void;
}

export function NavigationTabs({ currentTab, onTabChange }: NavigationTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={currentTab} onChange={(_, newValue) => onTabChange(newValue)}>
        <Tab label="Salas Ocupadas" />
        <Tab label="Salas Disponíveis" />
      </Tabs>
    </Box>
  );
} 