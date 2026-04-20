import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
    RiAddLine, RiBriefcaseLine, RiCalendarEventLine,
    RiGiftLine, RiHeartPulseLine, RiStarLine
} from 'react-icons/ri';
import { useApplications } from '../hooks/useApplications';
import TopNav from '../components/TopNav';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import { formatDate, isUpcoming } from '../utils/helpers';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const PIE_COLORS = ['#0ea5e9', '#f59e0b', '#22c55e', '#ef4444', '#a78bfa'];

export default function Dashboard() {
    const { applications, stats, deleteApplication } = useApplications();

    const upcomingInterviews = applications
        .filter(a => a.interviewDate && isUpcoming(a.interviewDate))
        .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
        .slice(0, 3);

    const recentApps = [...applications]
        .filter(a => a.appliedDate)
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 4);

    const pieData = [
        { name: 'Applied', value: stats.applied },
        { name: 'Interviewing', value: stats.interviewing },
        { name: 'Offer', value: stats.offer },
        { name: 'Rejected', value: stats.rejected },
        { name: 'Saved', value: stats.saved },
    ].filter(d => d.value > 0);

    const handleDelete = (id) => {
        deleteApplication(id);
        toast.success('Application removed');
    };

    return (
        <div>
            <TopNav title="Dashboard" subtitle="Welcome back! Here's your job search overview." />
            <div className="page-container">
                {/* Hero Banner */}
                <div className="hero-banner">
                    <div className="hero-banner-content">
                        <h2>You're on a roll! 🚀</h2>
                        <p>Keep tracking your applications and stay on top of your job search journey.</p>
                        <div className="hero-banner-stats">
                            <div className="hero-stat-item">
                                <span>{stats.total}</span>
                                <span>Applications</span>
                            </div>
                            <div className="hero-stat-item">
                                <span>{stats.interviewing}</span>
                                <span>In Progress</span>
                            </div>
                            <div className="hero-stat-item">
                                <span>{stats.offer}</span>
                                <span>Offers 🎉</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid-4" style={{ marginBottom: '2rem' }}>
                    <StatCard
                        emoji="📨"
                        label="Total Applications"
                        value={stats.total}
                        gradient="linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)"
                        change={3}
                    />
                    <StatCard
                        emoji="🎙️"
                        label="Interviewing"
                        value={stats.interviewing}
                        gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
                        change={1}
                    />
                    <StatCard
                        emoji="🎉"
                        label="Offers Received"
                        value={stats.offer}
                        gradient="linear-gradient(135deg, #22c55e 0%, #4ade80 100%)"
                        change={0}
                    />
                    <StatCard
                        emoji="📚"
                        label="Bookmarked"
                        value={stats.bookmarked}
                        gradient="linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)"
                        change={2}
                    />
                </div>

                <div className="grid-2" style={{ marginBottom: '2rem', alignItems: 'start' }}>
                    {/* Upcoming Interviews */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">🗓️ Upcoming Interviews</span>
                            <Link to="/applications" style={{ fontSize: '0.78rem', color: 'var(--primary-500)', fontWeight: 600 }}>
                                View all →
                            </Link>
                        </div>
                        <div className="card-body" style={{ padding: '1rem' }}>
                            {upcomingInterviews.length === 0 ? (
                                <EmptyState
                                    icon="🗓️"
                                    title="No upcoming interviews"
                                    description="Add an interview date to any application to see it here."
                                />
                            ) : (
                                upcomingInterviews.map(app => (
                                    <div key={app.id} className="interview-alert">
                                        <div className="interview-alert-icon">🎙️</div>
                                        <div className="interview-alert-content">
                                            <p>{app.company} — {app.role}</p>
                                            <p>{app.location}</p>
                                        </div>
                                        <span className="interview-alert-time">{formatDate(app.interviewDate)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Pipeline Chart */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">📊 Application Pipeline</span>
                        </div>
                        <div className="card-body" style={{ padding: '1rem' }}>
                            {pieData.length === 0 ? (
                                <EmptyState icon="📊" title="No data yet" description="Start adding applications to see analytics." />
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={85}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(v, n) => [v, n]}
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: '1px solid #e4e4e7',
                                                fontFamily: 'Plus Jakarta Sans',
                                                fontSize: '0.8rem',
                                            }}
                                        />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(v) => <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{v}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Applications */}
                <div>
                    <div className="section-header">
                        <h2 className="section-title">🆕 Recent Applications</h2>
                        <Link to="/applications" className="btn btn-outline btn-sm">
                            View All
                        </Link>
                    </div>
                    {recentApps.length === 0 ? (
                        <EmptyState
                            icon="💼"
                            title="No applications yet"
                            description="Start tracking your first job application!"
                            action={
                                <Link to="/applications/new" className="btn btn-primary">
                                    <RiAddLine /> Add Your First Job
                                </Link>
                            }
                        />
                    ) : (
                        <div className="grid-cards">
                            <AnimatePresence>
                                {recentApps.map(app => (
                                    <JobCard key={app.id} application={app} onDelete={handleDelete} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
