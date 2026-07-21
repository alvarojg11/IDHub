import type { ScoringTool as ScoringToolData } from "@/lib/curriculum/modules";

export default function ScoringTool({ tool }: { tool: ScoringToolData }) {
  return (
    <figure className="my-6 overflow-hidden border border-[var(--border)]">
      <figcaption className="border-b border-[var(--border)] bg-[var(--background-soft)] px-4 py-2.5">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {tool.name}
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{tool.purpose}</p>
      </figcaption>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-white">
              <th
                scope="col"
                className="idhub-kicker px-3 py-2 text-left text-[0.62rem]"
              >
                Factor
              </th>
              <th
                scope="col"
                className="idhub-kicker w-px px-3 py-2 text-left text-[0.62rem]"
              >
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {tool.points.map((p, i) => (
              <tr
                key={i}
                className="align-top border-b border-[var(--border)] last:border-b-0"
              >
                <td className="px-3 py-2.5 text-[var(--ink-soft)]">
                  {p.factor}
                </td>
                <td className="px-3 py-2.5 text-center font-semibold text-[var(--foreground)]">
                  {p.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--border)] bg-white px-4 py-3">
        <p className="idhub-kicker mb-2">Interpretation</p>
        <div className="grid gap-2">
          {tool.interpretation.map((band, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm"
            >
              <span className="font-semibold text-[var(--primary)]">
                {band.range}
              </span>
              <span className="text-[var(--ink-soft)]">
                <span className="font-medium text-[var(--foreground)]">
                  {band.meaning}.
                </span>{" "}
                {band.action}
              </span>
            </div>
          ))}
        </div>
        {tool.source ? (
          <p className="mt-3 text-xs text-[var(--muted)]">{tool.source}</p>
        ) : null}
      </div>
    </figure>
  );
}
