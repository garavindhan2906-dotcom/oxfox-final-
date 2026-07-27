type DividerColor = 'white' | 'neutral-50' | 'brand';

const FILL: Record<DividerColor, string> = {
  white: '#ffffff',
  'neutral-50': '#fafaf9',
  brand: '#b5642c',
};

/** Organic curved section separator, echoing the reference site's tech-forward wave dividers. */
export default function CurvedDivider({
  color = 'white',
  flip = false,
}: {
  color?: DividerColor;
  flip?: boolean;
}) {
  return (
    <div className={`pointer-events-none relative -mt-1 h-8 w-full overflow-hidden sm:h-16 ${flip ? 'rotate-180' : ''}`}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full">
        <path
          d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,48 L1440,120 L0,120 Z"
          fill={FILL[color]}
        />
      </svg>
    </div>
  );
}
