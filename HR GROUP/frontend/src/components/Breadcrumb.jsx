import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
      <Link
        to="/dashboard"
        className="hover:text-primary transition-colors flex items-center gap-1 py-1"
      >
        <FiHome size={14} />
        <span>Home</span>
      </Link>
      
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <FiChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
            {isLast ? (
              <span className="font-medium text-slate-700 dark:text-slate-200 py-1">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-primary transition-colors py-1"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
