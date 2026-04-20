import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApplications } from '../hooks/useApplications';
import TopNav from '../components/TopNav';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { getMonthlyData } from '../utils/helpers';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area
} from 'recharts';

const PIE_COLORS = ['#0ea5e9', '#f59e0b', '#22c55e', '#ef4444', '#a78bfa'];
const PLATFORM_COLORS = ['#f43f5e', '#8b5cf6', '#0ea5e9', '#22c55e', '#f59e0b', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            boxShadow: 'var(--shadow-md)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
        }}>
            <p style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} style={{ color: p.fill || p.color }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

export default function Analytics() {
    const { applications, stats } = useApplications();

    const pieData = [
        { name: 'Applied', value: stats.applied },
        { name: 'Interviewing', value: stats.interviewing },
        { name: 'Offer', value: stats.offer },
        { name: 'Rejected', value: stats.rejected },
        { name: 'Saved', value: stats.saved },
    ].filter(d => d.value > 0);

    const monthlyData = useMemo(() => getMonthlyData(applications), [applications]);

    const platformData = useMemo(() => {
        const counts = {};
        applications.forEach(a => {
            if (!a.platform) return;
            counts[a.platform] = (counts[a.platform] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [applications]);

    const responseRate = stats.total > 0
        ? Math.round(((stats.interviewing + stats.offer) / Math.max(stats.total - stats.saved, 1)) * 100)
        : 0;

    const offerRate = stats.total > 0
        ? Math.round((stats.offer / Math.max(stats.total - stats.saved, 1)) * 100)
        : 0;

    const avgSalary = useMemo(() => {
        const withSalary = applications.filter(a => a.salaryMin);
        if (!withSalary.length) return 0;
        return Math.round(withSalary.reduce((s, a) => s + ((a.salaryMin + (a.salaryMax || a.salaryMin)) / 2), 0) / withSalary.length);
    }, [applications]);

    return (
        <div>
            <TopNav title="Analytics" subtitle="Deep dive into your job search performance" />
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Analytics Overview</h1>
                        <p className="page-subtitle">Your job search insights at a glance</p>
                    </div>
                </div>

                {/* KPI Stats */}
                <div className="grid-4" style={{ marginBottom: '2rem' }}>
                    <StatCard emoji="📨" label="Total Applications" value={stats.total} gradient="linear-gradient(135deg, #0ea5e9, #38bdf8)" />
                    <StatCard emoji="📈" label="Response Rate" value={`${responseRate}%`} gradient="linear-gradient(135deg, #f59e0b, #fbbf24)" />
                    <StatCard emoji="🎉" label="Offer Rate" value={`${offerRate}%`} gradient="linear-gradient(135deg, #22c55e, #4ade80)" />
                    <StatCard
                        emoji="💰"
                        label="Avg. Salary"
                        value={avgSalary > 0 ? `$${Math.round(avgSalary / 1000)}k` : '—'}
                        gradient="linear-gradient(135deg, #a78bfa, #c4b5fd)"
                    />
                </div>

                <div className="grid-2" style={{ marginBottom: '2rem', alignItems: 'start' }}>
                    {/* Pipeline Pie */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">🎯 Application Pipeline</span>
                        </div>
                        <div className="card-body">
                            {pieData.length === 0 ? (
                                <EmptyState icon="📊" title="No data" description="Add applications to see pipeline breakdown." />
                            ) : (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {pieData.map((entry, i) => (
                                                <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={v => <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{v}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Platform breakdown */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">🌐 Applications by Platform</span>
                        </div>
                        <div className="card-body">
                            {platformData.length === 0 ? (
                                <EmptyState icon="🌐" title="No data" description="Add applications with a platform to see breakdown." />
                            ) : (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={platformData} layout="vertical" margin={{ left: 10, right: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: '#71717a' }} />
                                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#71717a' }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" name="Applications" radius={[0, 6, 6, 0]}>
                                            {platformData.map((entry, i) => (
                                                <Cell key={entry.name} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Monthly trend */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="card-header">
                        <span className="card-title">📅 Monthly Application Trend</span>
                    </div>
                    <div className="card-body">
                        {monthlyData.length === 0 ? (
                            <EmptyState icon="📅" title="No monthly data" description="Applications will appear here once you start adding them." />
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#71717a' }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        name="Applications"
                                        stroke="#f43f5e"
                                        strokeWidth={2.5}
                                        fill="url(#areaGrad)"
                                        activeDot={{ r: 6, fill: '#f43f5e', stroke: 'white', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Status breakdown list */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">📋 Status Breakdown</span>
                    </div>
                    <div className="card-body">
                        {[
                            { label: 'Applied', value: stats.applied, color: '#0ea5e9', emoji: '📨' },
                            { label: 'Interviewing', value: stats.interviewing, color: '#f59e0b', emoji: '🎙️' },
                            { label: 'Offer Received', value: stats.offer, color: '#22c55e', emoji: '🎉' },
                            { label: 'Rejected', value: stats.rejected, color: '#ef4444', emoji: '❌' },
                            { label: 'Saved', value: stats.saved, color: '#a78bfa', emoji: '⭐' },
                        ].map(({ label, value, color, emoji }) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '1rem',
                                }}
                            >
                                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.3rem',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                    }}>
                                        <span>{label}</span>
                                        <span style={{ color }}>{value}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${stats.total > 0 ? (value / stats.total) * 100 : 0}%`,
                                                background: color,
                                            }}
                                        />
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '35px', textAlign: 'right' }}>
                                    {stats.total > 0 ? Math.round((value / stats.total) * 100) : 0}%
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
