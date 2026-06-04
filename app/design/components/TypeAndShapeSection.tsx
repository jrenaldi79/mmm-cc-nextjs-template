/**
 * Typography scale and shape (corner radius) reference. Shows the real font
 * (Inter) at each documented size and the rounding tokens used across the app.
 */
const TYPE_SAMPLES = [
  { label: 'Heading 1', className: 'text-4xl font-bold tracking-tight' },
  { label: 'Heading 2', className: 'text-2xl font-semibold tracking-tight' },
  { label: 'Body', className: 'text-base' },
  { label: 'Label', className: 'text-sm font-medium' },
  { label: 'Small', className: 'text-xs text-muted-foreground' },
];

const RADII = [
  { name: 'rounded-sm', className: 'rounded-sm' },
  { name: 'rounded-md', className: 'rounded-md' },
  { name: 'rounded-lg', className: 'rounded-lg' },
];

export function TypeAndShapeSection() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Typography &amp; shape</h2>
        <p className="max-w-3xl text-muted-foreground">
          One typeface — <strong>Inter</strong> — at a few consistent sizes,
          plus a single corner-rounding style. Reusing these keeps text and
          edges looking uniform everywhere.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">
            Type scale
          </p>
          {TYPE_SAMPLES.map((sample) => (
            <div
              key={sample.label}
              className="flex items-baseline justify-between gap-4 border-b pb-2 last:border-0"
            >
              <span className={sample.className}>{sample.label}</span>
              <code className="shrink-0 text-xs text-muted-foreground">
                {sample.label}
              </code>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">
            Corner radius
          </p>
          <div className="flex flex-wrap gap-5">
            {RADII.map((radius) => (
              <div key={radius.name} className="text-center">
                <div
                  className={`h-20 w-20 border-2 border-primary bg-primary/10 ${radius.className}`}
                />
                <code className="mt-2 block text-xs text-muted-foreground">
                  {radius.name}
                </code>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            All three come from a single{' '}
            <code className="text-foreground">--radius</code> value in
            globals.css.
          </p>
        </div>
      </div>
    </section>
  );
}
