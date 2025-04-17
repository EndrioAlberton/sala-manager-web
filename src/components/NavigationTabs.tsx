import React from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

interface NavigationTabsProps {
  currentTab: number;
  onTabChange: (newTab: number) => void;
}

export function NavigationTabs({ currentTab, onTabChange }: NavigationTabsProps) {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <Paper 
      sx={{ 
        mb: 3, 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 1
      }}
    >
      <Tabs
        value={currentTab}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        aria-label="navigation tabs"
      >
        <Tab 
          icon={<EventBusyIcon />} 
          label="Salas Ocupadas" 
          iconPosition="start"
          sx={{ py: 2 }}
        />
        <Tab 
          icon={<EventAvailableIcon />} 
          label="Salas Disponíveis" 
          iconPosition="start"
          sx={{ py: 2 }}
        />
      </Tabs>
    </Paper>
  );
} 