import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { RiSaveLine, RiArrowLeftLine } from 'react-icons/ri';
import { useApplications } from '../hooks/useApplications';
import { PLATFORMS, LOCATION_TYPES, STATUSES } from '../utils/mockData';

const schema = yup.object({
    company: yup.string().required('Company name is required'),
    role: yup.string().required('Job role is required'),
    appliedDate: yup.string().when('status', {
        is: (s) => s !== 'saved',
        then: (s) => s.required('Applied date is required for this status'),
        otherwise: (s) => s.notRequired(),
    }),
    location: yup.string().optional(),
    locationType: yup.string().optional(),
    salaryMin: yup.number().nullable().transform(v => (isNaN(v) ? null : v)).optional(),
    salaryMax: yup.number().nullable().transform(v => (isNaN(v) ? null : v)).optional(),
    platform: yup.string().optional(),
    status: yup.string().required(),
    interviewDate: yup.string().optional(),
    notes: yup.string().optional(),
});

const defaultValues = {
    company: '',
    role: '',
    location: '',
    locationType: 'remote',
    salaryMin: '',
    salaryMax: '',
    platform: 'LinkedIn',
    status: 'applied',
    appliedDate: new Date().toISOString().split('T')[0],
    interviewDate: '',
    notes: '',
};

export default function ApplicationForm({ existingApplication, isEdit }) {
    const navigate = useNavigate();
    const { addApplication, updateApplication } = useApplications();

    const {
        register, handleSubmit, watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: existingApplication || defaultValues,
    });

    useEffect(() => {
        if (existingApplication) reset(existingApplication);
    }, [existingApplication]);

    const watchedStatus = watch('status');

    const onSubmit = (data) => {
        if (isEdit && existingApplication) {
            updateApplication(existingApplication.id, data);
            toast.success('✅ Application updated!');
        } else {
            addApplication(data);
            toast.success('🎉 Application added!');
        }
        navigate('/applications');
    };

    const inputCls = (field) => `form-input${errors[field] ? ' error' : ''}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-header">
                <div>
                    <h1 className="page-title">{isEdit ? 'Edit Application' : 'Add New Application'}</h1>
                    <p className="page-subtitle">
                        {isEdit ? 'Update the details of your job application.' : 'Track a new opportunity in your job search.'}
                    </p>
                </div>
                <button className="btn btn-outline" onClick={() => navigate(-1)}>
                    <RiArrowLeftLine /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">🏢 Company & Role</span>
                    </div>
                    <div className="card-body">
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label form-label-required">Company Name</label>
                                <input
                                    className={inputCls('company')}
                                    placeholder="e.g. Google, Meta, Startup Inc."
                                    {...register('company')}
                                />
                                {errors.company && (
                                    <span className="form-error">⚠ {errors.company.message}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label form-label-required">Job Role</label>
                                <input
                                    className={inputCls('role')}
                                    placeholder="e.g. Senior Frontend Engineer"
                                    {...register('role')}
                                />
                                {errors.role && (
                                    <span className="form-error">⚠ {errors.role.message}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. San Francisco, CA"
                                    {...register('location')}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location Type</label>
                                <select className="form-select" {...register('locationType')}>
                                    {LOCATION_TYPES.filter(l => l.value !== 'all').map(l => (
                                        <option key={l.value} value={l.value}>{l.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginTop: '1.25rem' }}>
                    <div className="card-header">
                        <span className="card-title">💼 Application Details</span>
                    </div>
                    <div className="card-body">
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Platform</label>
                                <select className="form-select" {...register('platform')}>
                                    {PLATFORMS.filter(p => p.value !== 'all').map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" {...register('status')}>
                                    {STATUSES.filter(s => s.value !== 'all').map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className={`form-label ${watchedStatus !== 'saved' ? 'form-label-required' : ''}`}>
                                    Applied Date
                                </label>
                                <input
                                    type="date"
                                    className={inputCls('appliedDate')}
                                    {...register('appliedDate')}
                                />
                                {errors.appliedDate && (
                                    <span className="form-error">⚠ {errors.appliedDate.message}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Interview Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    {...register('interviewDate')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginTop: '1.25rem' }}>
                    <div className="card-header">
                        <span className="card-title">💰 Salary Range</span>
                    </div>
                    <div className="card-body">
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Min Salary (USD/year)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="e.g. 120000"
                                    {...register('salaryMin')}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Salary (USD/year)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="e.g. 160000"
                                    {...register('salaryMax')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginTop: '1.25rem' }}>
                    <div className="card-header">
                        <span className="card-title">📝 Notes</span>
                    </div>
                    <div className="card-body">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Notes & Reminders</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Add any notes, referrals, follow-up reminders, interview tips..."
                                {...register('notes')}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        <RiSaveLine />
                        {isEdit ? 'Save Changes' : 'Add Application'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
