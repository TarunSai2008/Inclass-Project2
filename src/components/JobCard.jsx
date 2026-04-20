import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    RiBookmarkLine, RiBookmarkFill, RiEditLine, RiDeleteBinLine,
    RiMapPinLine, RiMoneyDollarCircleLine, RiCalendarLine,
    RiLink, RiComputerLine
} from 'react-icons/ri';
import { useApplications } from '../hooks/useApplications';
import { formatDate, formatSalaryFull, getStatusColor, getStatusLabel, getLogoUrl, getInitials } from '../utils/helpers';

export default function JobCard({ application, onDelete }) {
    const { toggleBookmark } = useApplications();
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const {
        id, company, role, location, locationType,
        salaryMin, salaryMax, appliedDate, status, bookmarked, platform, notes,
    } = application;

    const locationTypeIcon = {
        remote: '🏠',
        onsite: '🏢',
        hybrid: '🔀',
    }[locationType] || '📍';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`job-card ${bookmarked ? 'bookmarked' : ''}`}
        >
            <div className="job-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div className="company-logo-wrapper">
                        {!imgError ? (
                            <img
                                src={getLogoUrl(company)}
                                alt={company}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <span className="company-logo-fallback">
                                {getInitials(company)}
                            </span>
                        )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div className="job-card-company">{company}</div>
                        <div className="job-card-role" style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {role}
                        </div>
                    </div>
                </div>
                <span className={`badge badge-${getStatusColor(status)}`}>
                    <span className="badge-dot" />
                    {getStatusLabel(status)}
                </span>
            </div>

            <div className="job-card-meta">
                {location && (
                    <span className="job-card-meta-item">
                        <RiMapPinLine />
                        {location}
                    </span>
                )}
                {locationType && (
                    <span className="job-card-meta-item">
                        {locationTypeIcon} {locationType.charAt(0).toUpperCase() + locationType.slice(1)}
                    </span>
                )}
                {(salaryMin || salaryMax) && (
                    <span className="job-card-meta-item">
                        <RiMoneyDollarCircleLine />
                        {formatSalaryFull(salaryMin, salaryMax)}
                    </span>
                )}
                {platform && (
                    <span className="job-card-meta-item">
                        <RiLink />
                        {platform}
                    </span>
                )}
            </div>

            {notes && (
                <div className="notes-preview">{notes}</div>
            )}

            <div className="job-card-footer">
                <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <RiCalendarLine />
                    {appliedDate ? formatDate(appliedDate) : 'Not applied yet'}
                </span>

                <div className="job-card-actions">
                    <button
                        className={`bookmark-btn ${bookmarked ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(id); }}
                        title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                    >
                        {bookmarked ? <RiBookmarkFill /> : <RiBookmarkLine />}
                    </button>
                    <button
                        className="edit-btn"
                        onClick={(e) => { e.stopPropagation(); navigate(`/applications/${id}`); }}
                        title="Edit"
                    >
                        <RiEditLine />
                    </button>
                    <button
                        className="delete-btn"
                        onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}
                        title="Delete"
                    >
                        <RiDeleteBinLine />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
