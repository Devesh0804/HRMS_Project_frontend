import React from 'react';

const FormActions = ({ 
  submitLabel = 'Save', 
  resetLabel = 'Reset',
  onSubmit,
  onReset,
  submitDisabled = false,
  showReset = true
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitDisabled}
        className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
      {showReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
};

export default FormActions;