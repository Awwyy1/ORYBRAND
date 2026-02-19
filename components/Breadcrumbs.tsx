import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-1 flex-wrap">
        <li>
          <Link
            to="/"
            className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-sky-400 transition-colors"
          >
            Home
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-slate-600" />
              {isLast || !item.href ? (
                <span className="text-[10px] text-white uppercase tracking-widest">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-sky-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
