import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np

fig, ax = plt.subplots(figsize=(10, 6.5), dpi=150)

# ── Data ──────────────────────────────────────────────
weeks        = [0, 2, 4]
pcr_values   = [48000, 52000, 76000]
pcr_labels   = ["48,000", "52,000", "76,000"]

# ── Plot ──────────────────────────────────────────────
ax.plot(weeks, pcr_values, color="#1e3a5f", linewidth=2.5, zorder=3,
        marker="o", markersize=9, markerfacecolor="white",
        markeredgecolor="#1e3a5f", markeredgewidth=2.5)

# Shaded "treatment zone"
ax.axvspan(-0.4, 4.4, color="#eef4fa", zorder=0)

# ── Annotations ───────────────────────────────────────
ax.annotate("IV ganciclovir 5 mg/kg q12h\n(renal-adjusted) started",
            xy=(0, 48000), xytext=(0.15, 20000),
            fontsize=10.5, color="#333333", ha="left", va="top",
            fontstyle="italic",
            arrowprops=dict(arrowstyle="->", color="#888888", lw=1.2))

ax.annotate("Virologic\nfailure",
            xy=(4, 76000), xytext=(3.0, 120000),
            fontsize=11, color="#b91c1c", ha="center", va="bottom",
            fontweight="bold",
            arrowprops=dict(arrowstyle="->", color="#b91c1c", lw=1.5))

# Data labels above each point
for w, v, lbl in zip(weeks, pcr_values, pcr_labels):
    ax.annotate(lbl, xy=(w, v), xytext=(0, 14), textcoords="offset points",
                ha="center", fontsize=11, fontweight="bold", color="#1e3a5f")

# ── Axes ──────────────────────────────────────────────
ax.set_xlim(-0.5, 4.5)
ax.set_ylim(8000, 160000)
ax.set_yscale("log")
ax.yaxis.set_major_formatter(ticker.FuncFormatter(
    lambda x, _: f"{int(x/1000)}K" if x < 1_000_000 else f"{x/1_000_000:.0f}M"))
ax.yaxis.set_major_locator(ticker.FixedLocator([10000, 20000, 50000, 100000]))
ax.yaxis.set_minor_formatter(ticker.NullFormatter())

ax.set_xticks(weeks)
ax.set_xticklabels(["Baseline\n(pre-treatment)", "Week 2", "Week 4"],
                   fontsize=11, color="#333333")
ax.set_xlabel("Duration of IV Ganciclovir Therapy", fontsize=12.5,
              color="#222222", labelpad=12)
ax.set_ylabel("CMV Quantitative PCR  (IU/mL)", fontsize=12.5,
              color="#222222", labelpad=10)

# ── Title ─────────────────────────────────────────────
ax.set_title("Serum CMV Viral Load Trajectory",
             fontsize=15, fontweight="bold", color="#1e3a5f", pad=16)

# ── Grid & spines ─────────────────────────────────────
ax.grid(axis="y", which="major", color="#d0d5dd", linewidth=0.6, zorder=1)
ax.grid(axis="y", which="minor", linewidth=0.3, color="#e8eaed", zorder=1)
for spine in ["top", "right"]:
    ax.spines[spine].set_visible(False)
for spine in ["left", "bottom"]:
    ax.spines[spine].set_color("#888888")

ax.tick_params(colors="#555555")

plt.tight_layout()
out = "/Users/alvaroayala/Desktop/IDHub/public/cases/cmv-resistance-sot/viral-load-trend.png"
plt.savefig(out, dpi=200, bbox_inches="tight", facecolor="white")
print(f"Saved: {out}")
