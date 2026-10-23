import { useState } from 'react';
import { Award, Check, Sparkles, X, Gift, Zap, Ticket } from 'lucide-react';
import { REWARD_RULES, REWARDS_CATALOG, getUserLevel } from '../data/rewardsData';

export default function RewardsModal({ isOpen, onClose, points, redeemedIds, onRedeem }) {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const currentLevel = getUserLevel(points);

  const handleCopyCode = (id, code) => {
    navigator.clipboard?.writeText?.(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <Award size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">MessMate Rewards</h2>
              <p className="text-xs text-slate-500">Earn points for every rating & claim hostel perks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Points Status Hero Card */}
          <div className="bg-gradient-to-br from-green-900 to-slate-900 rounded-xl p-4 text-white relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-xs font-medium text-green-300 uppercase tracking-wider">Your Balance</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold tracking-tight text-white">{points}</span>
                  <span className="text-sm font-medium text-green-200">MessPoints</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-green-300 border border-white/10 backdrop-blur-sm">
                  <Sparkles size={12} />
                  {currentLevel.name}
                </span>
                <p className="text-[11px] text-slate-300 mt-1">Tier {currentLevel.level} of 4</p>
              </div>
            </div>

            {/* Progress to next milestone */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Next Tier: {currentLevel.nextMilestone} pts</span>
                <span>{currentLevel.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-green-400 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${currentLevel.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* How to Earn Points Section */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" /> How to Earn Points
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <div className="text-sm font-bold text-green-600">+{REWARD_RULES.PER_RATING} pts</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Per dish rating</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <div className="text-sm font-bold text-green-600">+{REWARD_RULES.PER_COMMENT} pts</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Written note</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <div className="text-sm font-bold text-green-600">+{REWARD_RULES.MEAL_COMPLETION_BONUS} pts</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Full meal rated</div>
              </div>
            </div>
          </div>

          {/* Available Rewards Catalog */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Gift size={14} className="text-slate-500" /> Redeemable Perks
            </h3>
            <div className="space-y-2.5">
              {REWARDS_CATALOG.map((reward) => {
                const isRedeemed = redeemedIds.includes(reward.id);
                const canAfford = points >= reward.pointsCost;

                return (
                  <div
                    key={reward.id}
                    className={[
                      'border rounded-xl p-3.5 transition-all duration-150 flex items-center justify-between gap-3',
                      isRedeemed 
                        ? 'bg-green-50/60 border-green-200'
                        : canAfford
                          ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                          : 'bg-slate-50/50 border-slate-200 opacity-75'
                    ].join(' ')}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{reward.title}</span>
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {reward.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{reward.description}</p>
                      
                      {/* Redeemed Voucher Code */}
                      {isRedeemed && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-green-800 bg-green-100/80 px-2 py-0.5 rounded border border-green-200">
                            {reward.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(reward.id, reward.code)}
                            className="text-[11px] text-green-700 hover:underline flex items-center gap-0.5"
                          >
                            {copiedId === reward.id ? <Check size={11} /> : null}
                            {copiedId === reward.id ? 'Copied!' : 'Copy Code'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {isRedeemed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-green-700 bg-green-100">
                          <Check size={12} strokeWidth={2.5} /> Redeemed
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onRedeem(reward)}
                          className={[
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5',
                            canAfford
                              ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-sm'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          ].join(' ')}
                        >
                          <Ticket size={12} />
                          {reward.pointsCost} pts
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
