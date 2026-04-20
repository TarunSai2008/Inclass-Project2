import React from 'react';
import { STATUSES, PLATFORMS, LOCATION_TYPES, SORT_OPTIONS } from '../utils/mockData';
import { RiFilterLine, RiArrowUpDownLine } from 'react-icons/ri';

export default function Filters({ filters, onFilterChange, sortBy, onSortChange }) {
    const statusFilters = STATUSES;
    const platforms = PLATFORMS;
    const locationTypes = LOCATION_TYPES;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RiFilterLine style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Status
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RiArrowUpDownLine style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="filter-chips">
                {statusFilters.map((s) => (
                    <button
                        key={s.value}
                        className={`filter-chip ${filters.status === s.value ? 'active' : ''}`}
                        onClick={() => onFilterChange({ ...filters, status: s.value })}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Platform:</span>
                    <select
                        className="sort-select"
                        value={filters.platform}
                        onChange={(e) => onFilterChange({ ...filters, platform: e.target.value })}
                    >
                        {platforms.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Location:</span>
                    <select
                        className="sort-select"
                        value={filters.location}
                        onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                    >
                        {locationTypes.map((l) => (
                            <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                    </select>
                </div>

                <button
                    className={`filter-chip ${filters.bookmarked ? 'active' : ''}`}
                    onClick={() => onFilterChange({ ...filters, bookmarked: !filters.bookmarked })}
                >
                    ⭐ Bookmarked only
                </button>
            </div>
        </div>
    );
}
