import React, { createContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MOCK_APPLICATIONS } from '../utils/mockData';

export const ApplicationContext = createContext(null);

export function ApplicationProvider({ children }) {
    const [applications, setApplications] = useLocalStorage('job-tracker-apps', MOCK_APPLICATIONS);

    return (
        <ApplicationContext.Provider value={{ applications, setApplications }}>
            {children}
        </ApplicationContext.Provider>
    );
}
