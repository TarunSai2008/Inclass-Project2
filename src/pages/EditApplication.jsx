import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import ApplicationForm from '../components/ApplicationForm';
import { useApplications } from '../hooks/useApplications';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

export default function EditApplication() {
    const { id } = useParams();
    const { getApplicationById } = useApplications();
    const app = getApplicationById(id);

    if (!app) {
        return (
            <div>
                <TopNav title="Edit Application" />
                <div className="page-container">
                    <EmptyState
                        icon="😕"
                        title="Application not found"
                        description="This application may have been deleted or the link is invalid."
                        action={<Link to="/applications" className="btn btn-primary">Back to Applications</Link>}
                    />
                </div>
            </div>
        );
    }

    return (
        <div>
            <TopNav title="Edit Application" subtitle={`Editing: ${app.company} — ${app.role}`} />
            <div className="page-container">
                <ApplicationForm existingApplication={app} isEdit={true} />
            </div>
        </div>
    );
}
