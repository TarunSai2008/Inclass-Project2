import { useContext } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { generateId } from '../utils/helpers';

export function useApplications() {
    const context = useContext(ApplicationContext);
    if (!context) throw new Error('useApplications must be used within ApplicationProvider');
    const { applications, setApplications } = context;

    const addApplication = (data) => {
        const app = { ...data, id: generateId(), bookmarked: false };
        setApplications((prev) => [app, ...prev]);
        return app;
    };

    const updateApplication = (id, data) => {
        setApplications((prev) =>
            prev.map((app) => (app.id === id ? { ...app, ...data } : app))
        );
    };

    const deleteApplication = (id) => {
        setApplications((prev) => prev.filter((app) => app.id !== id));
    };

    const toggleBookmark = (id) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, bookmarked: !app.bookmarked } : app
            )
        );
    };

    const getApplicationById = (id) => applications.find((app) => app.id === id);

    const stats = {
        total: applications.length,
        applied: applications.filter((a) => a.status === 'applied').length,
        interviewing: applications.filter((a) => a.status === 'interviewing').length,
        offer: applications.filter((a) => a.status === 'offer').length,
        rejected: applications.filter((a) => a.status === 'rejected').length,
        saved: applications.filter((a) => a.status === 'saved').length,
        bookmarked: applications.filter((a) => a.bookmarked).length,
    };

    return {
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        toggleBookmark,
        getApplicationById,
        stats,
    };
}
