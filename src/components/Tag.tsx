// Single source of truth for the tag pill used by interactive filters.
// The .astro counterpart at src/components/Tag.astro is for static contexts.
export default function Tag({ label }: { label: string }) {
  const cls = label.toLowerCase().replace(/\s+/g, '-');
  return <span class={`tag tag--${cls}`}>{label}</span>;
}
