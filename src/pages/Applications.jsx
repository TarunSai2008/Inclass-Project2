import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { RiAddLine } from 'react-icons/ri';
import { useApplications } from '../hooks/useApplications';
import { useDebounce } from '../hooks/useDebounce';
import TopNav from '../components/TopNav';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import {
    searchApplications, filterApplications, sortApplications
} from '../utils/helpers';

const PIPELINE_TABS = [
    { key: 'all', label: 'All Jobs', emoji: '💼' },
    { key: 'applied', label: 'Applied', emoji: '📨' },
    { key: 'interviewing', label: 'Interviewing', emoji: '🎙️' },
    { key: 'offer', label: 'Offer', emoji: '🎉' },
    { key: 'rejected', label: 'Rejected', emoji: '❌' },
    { key: 'saved', label: 'Saved', emoji: '⭐' },
];

const defaultFilters = {
    status: 'all',
    platform: 'all',
    location: 'all',
    bookmarked: false,
};

export default function Applications() {
    const { applications, deleteApplication, stats } = useApplications();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [filters, setFilters] = useState(defaultFilters);
    const [sortBy, setSortBy] = useState('date-desc');

    const debouncedSearch = useDebounce(searchQuery, 400);

    const handleDelete = (id) => {
        deleteApplication(id);
        toast.success('🗑️ Application removed');
    };

    const tabCounts = useMemo(() => ({
        all: applications.length,
        applied: stats.applied,
        interviewing: stats.interviewing,
        offer: stats.offer,
        rejected: stats.rejected,
        saved: stats.saved,
    }), [applications, stats]);

    const displayed = useMemo(() => {
        let result = applications;
        // Tab filter
        if (activeTab !== 'all') {
            result = result.filter(a => a.status === activeTab);
        }
        // Status filter from chips (only if tab is 'all')
        if (activeTab === 'all') {
            result = filterApplications(result, { ...filters });
        } else {
            result = filterApplications(result, { ...filters, status: 'all' });
        }
        // Search
        result = searchApplications(result, debouncedSearch);
        // Sort
        result = sortApplications(result, sortBy);
        return result;
    }, [applications, activeTab, filters, debouncedSearch, sortBy]);

    return (
        <div>
            <TopNav
                title="Applications"
                subtitle={`Tracking ${applications.length} job applications`}
            />
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">My Applications</h1>
                        <p className="page-subtitle">Manage and track all your job opportunities</p>
                    </div>
                    <Link to="/applications/new" className="btn btn-primary">
                        <RiAddLine /> Add Application
                    </Link>
                </div>

                {/* Pipeline Tabs */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div className="pipeline-tabs">
                        {PIPELINE_TABS.map(tab => (
                            <button
                                key={tab.key}
                                className={`pipeline-tab ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setFilters(defaultFilters);
                                }}
                            >
                                {tab.emoji} {tab.label}
                                <span className="pipeline-tab-count">{tabCounts[tab.key]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="toolbar-left">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    </div>
                </div>

                {/* Filters */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div className="card-body" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                        <Filters
                            filters={filters}
                            onFilterChange={setFilters}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />
                    </div>
                </div>

                {/* Results info */}
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {displayed.length} result{displayed.length !== 1 ? 's' : ''}
                        {debouncedSearch && ` for "${debouncedSearch}"`}
                    </span>
                    {(debouncedSearch || filters.bookmarked || filters.status !== 'all' || filters.platform !== 'all' || filters.location !== 'all') && (
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => { setSearchQuery(''); setFilters(defaultFilters); }}
                            style={{ fontSize: '0.78rem' }}
                        >
                            Clear all filters
                        </button>
                    )}
                </div>

                {/* Applications Grid */}
                {displayed.length === 0 ? (
                    <EmptyState
                        icon="🔍"
                        title="No applications found"
                        description={
                            debouncedSearch
                                ? `No results found for "${debouncedSearch}". Try a different keyword.`
                                : "No applications match the current filters. Try adjusting your search."
                        }
                        action={
                            <Link to="/applications/new" className="btn btn-primary">
                                <RiAddLine /> Add Application
                            </Link>
                        }
                    />
                ) : (
                    <div className="grid-cards">
                        <AnimatePresence mode="popLayout">
                            {displayed.map(app => (
                                <JobCard key={app.id} application={app} onDelete={handleDelete} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
