import { Icon } from '@/lib/icons';

/**
 * Custom MDX components available inside /content/blog/*.mdx.
 * Kept deliberately small so article authors cannot drift far from the
 * design system's tokens.
 */

export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <ol
      style={{
        listStyle: 'none',
        padding: 0,
        margin: '1.6em 0',
        display: 'grid',
        gap: 12,
        counterReset: 'step',
      }}
    >
      {children}
    </ol>
  );
}

export function Step({
  n,
  title,
  children,
}: {
  n: string | number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li
      style={{
        display: 'flex',
        gap: 14,
        padding: '16px 18px',
        borderRadius: 12,
        background: 'color-mix(in srgb, var(--default-color), transparent 96%)',
        border: '1px solid color-mix(in srgb, var(--default-color), transparent 92%)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          flexShrink: 0,
          borderRadius: '50%',
          background: 'color-mix(in srgb, var(--accent-color), transparent 90%)',
          color: 'var(--accent-color)',
          fontFamily: 'var(--heading-font)',
          fontSize: 14,
        }}
      >
        {n}
      </span>
      <div>
        <p
          style={{
            margin: '0 0 4px',
            fontWeight: 600,
            fontSize: 15,
            color: 'var(--heading-color)',
            fontFamily: 'var(--default-font)',
          }}
        >
          {title}
        </p>
        <div style={{ fontSize: 15, lineHeight: 1.7 }}>{children}</div>
      </div>
    </li>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside
      style={{
        display: 'flex',
        gap: 12,
        padding: '16px 18px',
        margin: '1.6em 0',
        borderRadius: 12,
        background: 'color-mix(in srgb, var(--accent-color), transparent 94%)',
        borderLeft: '3px solid var(--accent-color)',
        fontSize: 15,
        lineHeight: 1.7,
      }}
    >
      <Icon name="info" size={18} />
      <div>{children}</div>
    </aside>
  );
}

export const MDX_COMPONENTS = { Steps, Step, Callout };
