'use client';

import { FaCircleInfo } from 'react-icons/fa6';
import { SCHEME_META_ICONS } from '@/lib/schemes';

interface Highlight {
  icon?: string;
  title?: string;
  description?: string;
}

export default function SchemeHighlightCard({ highlight, index, iconOverride }: { highlight: Highlight; index: number; iconOverride?: string }) {
  const iconName = iconOverride ?? highlight.icon;
  const Icon = iconName ? SCHEME_META_ICONS[iconName] || FaCircleInfo : FaCircleInfo;
  const CARD_COLORS = ['purple', 'teal', 'blue', 'amber', 'coral', 'green'] as const;
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const title = highlight.title?.trim();
  const description = highlight.description?.trim();
  const hasTitle = Boolean(title);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -10;
    const ry = ((x - cx) / cx) * 10;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    card.style.setProperty('--mx', `${Math.round((x / rect.width) * 100)}%`);
    card.style.setProperty('--my', `${Math.round((y / rect.height) * 100)}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform =
      'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  };

  return (
    <div
      className={`scheme-highlight-card card-${color}`}
      key={index}
      style={{ marginBottom: '10px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="scheme-highlight-icon">
        <Icon />
      </div>
      <div>
        <h3 className='text-left' style={{ margin: 0, fontSize: '1rem' }}>
          {hasTitle ? title : description}
        </h3>
        {hasTitle && description && (
          <p className='text-sm text-left' style={{ margin: 0, marginTop: 3 }}>{description}</p>
        )}
      </div>
    </div>
  );
}
