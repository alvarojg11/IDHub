import type { RegimenTable as RegimenTableData } from "@/lib/curriculum/modules";

export default function RegimenTable({
  table,
}: {
  table: RegimenTableData;
}) {
  const showHost = table.rows.some((r) => r.hostFactors);
  const showDuration = table.rows.some((r) => r.duration);

  return (
    <figure className="my-6 overflow-hidden border border-[var(--border)]">
      <figcaption className="border-b border-[var(--border)] bg-[var(--background-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
        {table.title}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-white">
              <th
                scope="col"
                className="idhub-kicker px-3 py-2 text-left text-[0.62rem]"
              >
                Scenario
              </th>
              {showHost ? (
                <th
                  scope="col"
                  className="idhub-kicker px-3 py-2 text-left text-[0.62rem]"
                >
                  Host factors
                </th>
              ) : null}
              <th
                scope="col"
                className="idhub-kicker px-3 py-2 text-left text-[0.62rem]"
              >
                Regimen
              </th>
              {showDuration ? (
                <th
                  scope="col"
                  className="idhub-kicker px-3 py-2 text-left text-[0.62rem]"
                >
                  Duration
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr
                key={i}
                className="align-top border-b border-[var(--border)] last:border-b-0"
              >
                <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                  {row.scenario}
                </td>
                {showHost ? (
                  <td className="px-3 py-3 text-[var(--muted)]">
                    {row.hostFactors ?? "—"}
                  </td>
                ) : null}
                <td className="px-3 py-3 text-[var(--ink-soft)]">
                  {row.regimen}
                  {row.note ? (
                    <span className="mt-1 block text-xs text-[var(--muted)]">
                      {row.note}
                    </span>
                  ) : null}
                </td>
                {showDuration ? (
                  <td className="px-3 py-3 text-[var(--muted)]">
                    {row.duration ?? "—"}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
