  import { useState } from 'react';
  import { cn } from '@/utils/cn';

  interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    size?: 'sm' | 'md';
  }

  const StarRating = ({ value, onChange, size = 'md' }: StarRatingProps) => {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => onChange && setHovered(star)}
            onMouseLeave={() => onChange && setHovered(0)}
            className={cn('transition-colors', onChange ? 'cursor-pointer' : 'cursor-default')}
          >
            <svg
              className={cn(starSize, active >= star ? 'text-amber-400' : 'text-brand-200')}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982
  20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  export default StarRating;
