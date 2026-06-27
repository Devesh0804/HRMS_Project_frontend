import React from 'react';

const InfoCard = ({ title, items = [] ,departmentsData}) => {
  return (
    <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-slate-200">
      <h3 className="text-base font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-slate-600">{item.label}</span>
            <span className="text-sm font-medium text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;