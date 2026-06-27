const RecruitmentStats = ({ candidates }) => {
  const totalApplications = candidates.length;
  const interviewsScheduled = candidates.filter(
    (candidate) => candidate.status === 'Interview'
  ).length;
  const hiredCount = candidates.filter(
    (candidate) => candidate.status === 'Hired'
  ).length;
  const hiringRate = totalApplications
    ? `${Math.round((hiredCount / totalApplications) * 100)}%`
    : '0%';

  const statCards = [
    {
      label: 'Total Applications',
      value: totalApplications,
      helper: 'All candidate applications',
    },
    {
      label: 'Interviews Scheduled',
      value: interviewsScheduled,
      helper: 'Candidates in interview stage',
    },
    {
      label: 'Hiring Rate',
      value: hiringRate,
      helper: 'Based on current applications',
    },
  ];

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm"
        >
          <p className="text-xs sm:text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
            {card.value}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">{card.helper}</p>
        </div>
      ))}
    </div>
  );
};

export default RecruitmentStats;
