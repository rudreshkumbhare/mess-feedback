import { CheckCircle2, Clock, UtensilsCrossed, ChefHat } from 'lucide-react';

export default function Header({ view, onViewChange }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed size={16} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <span className="font-semibold text-slate-900 text-[15px] leading-none block">MessMate</span>
            <span className="text-xs text-slate-400 leading-none block mt-0.5 hidden sm:block">{today}</span>
          </div>
        </div>

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
    </header>
  );
}
