import React, { createContext, useContext, useState } from 'react';
import { WORK_WEEK_TYPES } from '../utils/workWeekUtils';

const CompanySettingsContext = createContext({
  workWeekType: WORK_WEEK_TYPES.SUNDAY_BASED,
  timezone: 'Asia/Jerusalem',
  updateWorkWeekType: (type) => {},
  updateTimezone: (tz) => {}
});

export const CompanySettingsProvider = ({ children }) => {
  const [workWeekType, setWorkWeekType] = useState(WORK_WEEK_TYPES.SUNDAY_BASED);
  const [timezone, setTimezone] = useState('Asia/Jerusalem');

  const updateWorkWeekType = (type) => {
    setWorkWeekType(type);
    // Auto-update timezone based on common patterns (optional)
    if (type.id === 'sunday_based') {
      setTimezone('Asia/Jerusalem'); // Common for Sunday-based
    } else {
      setTimezone('America/New_York'); // Common for Monday-based
    }
  };

  const updateTimezone = (tz) => {
    setTimezone(tz);
  };

  return (
    <CompanySettingsContext.Provider value={{
      workWeekType,
      timezone,
      updateWorkWeekType,
      updateTimezone
    }}>
      {children}
    </CompanySettingsContext.Provider>
  );
};

export const useCompanySettings = () => useContext(CompanySettingsContext);