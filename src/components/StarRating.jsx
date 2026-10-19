import { Star } from 'lucide-react';

export default function StarRating({ value, onChange, size = 'md', readonly = false }) {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  const px = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange && onChange(star)}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            className={[
              'rounded transition-transform duration-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95',
            ].join(' ')}
          >
            <Star
              size={px}
              className={filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
