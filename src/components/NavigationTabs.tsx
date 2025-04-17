import React from 'react';
import { Tabs, Tab, Paper } from '@mui/material';
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
        mb: 2, 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
      }}
    >
      <Tabs
        value={currentTab}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        aria-label="navigation tabs"
        sx={{ minHeight: '48px' }}
      >
        <Tab 
          icon={<EventBusyIcon />} 
          label="Salas Ocupadas" 
          iconPosition="start"
          sx={{ py: 1.5, minHeight: '48px' }}
        />
        <Tab 
          icon={<EventAvailableIcon />} 
          label="Salas Disponíveis" 
          iconPosition="start"
          sx={{ py: 1.5, minHeight: '48px' }}
        />
      </Tabs>
    </Paper>
  );
} 