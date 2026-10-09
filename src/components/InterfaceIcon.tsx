import type { ReactNode } from 'react';

/** Vector ornaments keep their shape and colour on browsers with emoji fonts. */
export function InterfaceIcon({ symbol }: { symbol: string }) {
  const common = {
    className: 'interface-icon',
    viewBox: '0 0 24 24',
    width: '1em',
    height: '1em',
    'aria-hidden': true as const,
    focusable: 'false' as const,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  let shape: ReactNode;
  switch (symbol) {
    case '↗':
      shape = <path d="M5 19 19 5M5 5h14v14" />;
      break;
    case '☾':
      shape = <path d="M20.8 13.1A9 9 0 0 1 10.9 3.2 9 9 0 1 0 20.8 13.1Z" />;
      break;
    case '☀':
      shape = (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      );
      break;
    case '☰':
      shape = <path d="M4 6h16M4 12h16M4 18h16" />;
      break;
    default:
      shape = <path strokeWidth="3" d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6" />;
  }
  return (
    <svg {...common}>
      <title>{symbol}</title>
      {shape}
    </svg>
  );
}

export function vectorText(text: string): ReactNode {
  if (!/[↗✳☾☀☰]/u.test(text)) return text;
  return text
    .split(/([↗✳☾☀☰])/u)
    .map((part, index) =>
      /^[↗✳☾☀☰]$/u.test(part) ? <InterfaceIcon key={index} symbol={part} /> : part,
    );
}
