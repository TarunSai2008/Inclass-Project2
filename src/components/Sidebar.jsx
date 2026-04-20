import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    RiDashboardLine, RiBriefcaseLine, RiAddCircleLine,
    RiBarChart2Line, RiBookmarkLine, RiSparklingLine
} from 'react-icons/ri';
import { useApplications } from '../hooks/useApplications';

const navItems = [
    { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    { to: '/applications', icon: RiBriefcaseLine, label: 'Applications' },
    { to: '/applications/new', icon: RiAddCircleLine, label: 'Add Job' },
    { to: '/analytics', icon: RiBarChart2Line, label: 'Analytics' },
];

export default function Sidebar() {
    const { stats, applications } = useApplications();
    const bookmarked = applications.filter(a => a.bookmarked);

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <RiSparklingLine />
                </div>
                <div className="sidebar-logo-text">
                    <span>JobTracker</span>
                    <span>Smart Dashboard</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <span className="sidebar-section-label">Navigation</span>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <Icon className="sidebar-nav-icon" />
                        <span className="sidebar-nav-label">{label}</span>
                        {label === 'Applications' && (
                            <span className="sidebar-badge">{stats.total}</span>
                        )}
                    </NavLink>
                ))}

                <span className="sidebar-section-label">Quick Stats</span>

                <div style={{ padding: '0 0.75rem' }}>
                    {[
                        { label: 'Interviewing', count: stats.interviewing, color: '#f59e0b' },
                        { label: 'Offers', count: stats.offer, color: '#22c55e' },
                        { label: 'Bookmarked', count: stats.bookmarked, color: '#a78bfa' },
                    ].map(({ label, count, color }) => (
                        <div
                            key={label}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.45rem 0',
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: color,
                                        flexShrink: 0,
                                    }}
                                />
                                {label}
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem' }}>
                                {count}
                            </span>
                        </div>
                    ))}

                    <div style={{ marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <span>Response Rate</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary-500)' }}>
                                {stats.total > 0
                                    ? Math.round(((stats.interviewing + stats.offer) / Math.max(stats.total - stats.saved, 1)) * 100)
                                    : 0}%
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{
                                    width: stats.total > 0
                                        ? `${Math.min(((stats.interviewing + stats.offer) / Math.max(stats.total - stats.saved, 1)) * 100, 100)}%`
                                        : '0%',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">JT</div>
                    <div className="sidebar-user-info">
                        <span>Job Seeker</span>
                        <span>Active Search</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
