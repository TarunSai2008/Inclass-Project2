import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, color, gradient, change, emoji }) {
    return (
        <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                '--stat-color': color,
            }}
        >
            <div
                className="stat-icon"
                style={{ background: gradient || color, color: 'white' }}
            >
                {emoji || icon}
            </div>
            <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                {value}
            </div>
            <div className="stat-label">{label}</div>
            {change !== undefined && (
                <span className={`stat-change ${change > 0 ? 'up' : 'neutral'}`}>
                    {change > 0 ? '↑' : '→'} {Math.abs(change)} this week
                </span>
            )}
        </motion.div>
    );
}
