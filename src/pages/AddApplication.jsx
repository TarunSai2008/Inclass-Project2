import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import ApplicationForm from '../components/ApplicationForm';
import { useApplications } from '../hooks/useApplications';

export default function AddApplication() {
    return (
        <div>
            <TopNav title="Add Application" subtitle="Track a new job opportunity" />
            <div className="page-container">
                <ApplicationForm isEdit={false} />
            </div>
        </div>
    );
}
