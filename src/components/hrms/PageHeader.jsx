import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  subtitle, 
  backLink = '', 
  backLinkText = 'Back to Dashboard',
  moduleText = ''
}) => {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {moduleText && (
            <p className="text-sm text-indigo-600 font-semibold">{moduleText}</p>
          )}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

        {backLink && (
          <Link
            to={backLink}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {backLinkText}
          </Link>
        )}
      </div>
    </header>
  );
};

export default PageHeader;