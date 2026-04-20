import React from 'react';
import { format } from 'date-fns';
import { RiNotification3Line, RiSearchLine } from 'react-icons/ri';

export default function TopNav({ title, subtitle }) {
    const today = format(new Date(), 'EEEE, MMM dd');

    return (
        <header className="topnav">
            <div className="topnav-left">
                <h1>{title || 'Dashboard'}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="topnav-right">
                <span className="topnav-date"> {today}</span>
                <button
                    className="btn btn-ghost btn-icon tooltip"
                    data-tooltip="Notifications"
                    style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}
                >
                    <RiNotification3Line />
                </button>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                >
                    JS
                </div>
            </div>
        </header>
    );
}
