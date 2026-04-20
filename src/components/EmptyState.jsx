import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon = '🔍', title, description, action }) {
    return (
        <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="empty-state-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            {action}
        </motion.div>
    );
}
