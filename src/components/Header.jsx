import { CheckCircle2, ChefHat, Award } from 'lucide-react';

export default function Header({ view, onViewChange, points, onOpenRewards }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo & Date */}
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo.svg" 
            alt="MessMate Logo" 
            className="w-8 h-8 rounded-lg shadow-xs flex-shrink-0 object-contain" 
          />
          <div>
            <span className="font-semibold text-slate-900 text-[15px] leading-none block">MessMate</span>
            <span className="text-xs text-slate-400 leading-none block mt-0.5 hidden sm:block">{today}</span>
          </div>
        </div>

        {/* Right actions: Points Pill + View Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Reward Points Badge */}
          <button
            type="button"
            onClick={onOpenRewards}
            title="Click to view reward points & perks"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold hover:bg-amber-100/70 hover:border-amber-300 transition-all duration-150 active:scale-95 shadow-xs"
          >
            <Award size={14} className="text-amber-600" strokeWidth={2.2} />
            <span>{points} <span className="font-normal text-amber-700">pts</span></span>
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => onViewChange('student')}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
                view === 'student'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              <CheckCircle2 size={14} strokeWidth={2} />
              <span className="hidden sm:inline">Student</span>
              <span className="sm:hidden">Rate</span>
            </button>
            <button
              onClick={() => onViewChange('manager')}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
                view === 'manager'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              <ChefHat size={14} strokeWidth={2} />
              <span className="hidden sm:inline">Manager</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
