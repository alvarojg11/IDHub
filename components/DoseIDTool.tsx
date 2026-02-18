"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DOSEID_CATEGORY_LABELS,
  DOSEID_MEDICATIONS,
  medsForCategory,
  weightBasisLabel,
  type MedicationCategory,
  type RenalMode,
} from "@/lib/doseidData";
import {
  format1,
  normalizePatient,
  toCmFromImperial,
  toCmFromMetric,
  toKg,
  type BioSex,
} from "@/lib/doseidMath";

type WeightUnit = "kg" | "lb";
type HeightMode = "cm" | "ft_in";

const CATEGORY_ORDER: MedicationCategory[] = [
  "antibacterial",
  "mycobacterial_tb",
  "antifungal",
  "antiviral",
];

export default function DoseIDTool() {
  const [category, setCategory] = useState<MedicationCategory>("antibacterial");
  const medsInCategory = useMemo(() => medsForCategory(category), [category]);

  const [selectedMedicationIds, setSelectedMedicationIds] = useState<string[]>([]);
  const [indicationByMedication, setIndicationByMedication] = useState<Record<string, string>>({});
  const [addMedicationId, setAddMedicationId] = useState("");

  const [renalMode, setRenalMode] = useState<RenalMode>("standard");

  const [ageYears, setAgeYears] = useState<string>("55");
  const [sex, setSex] = useState<BioSex>("male");
  const [weightValue, setWeightValue] = useState<string>("70");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [heightMode, setHeightMode] = useState<HeightMode>("cm");
  const [heightCm, setHeightCm] = useState<string>("170");
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("7");
  const [serumCreatinine, setSerumCreatinine] = useState<string>("1.0");
  const [query, setQuery] = useState("");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogCategory, setCatalogCategory] = useState<MedicationCategory>("antibacterial");

  function indicationIdForMedication(medicationId: string): string {
    const med = DOSEID_MEDICATIONS.find((item) => item.id === medicationId);
    if (!med) return "";
    const current = indicationByMedication[medicationId];
    if (current && med.indications.some((ind) => ind.id === current)) {
      return current;
    }
    return med.indications[0]?.id ?? "";
  }

  function addMedication(nextMedicationId: string) {
    const med = DOSEID_MEDICATIONS.find((item) => item.id === nextMedicationId);
    if (!med) return;
    setSelectedMedicationIds((prev) => (prev.includes(med.id) ? prev : [...prev, med.id]));
    setIndicationByMedication((prev) => {
      if (prev[med.id]) return prev;
      return { ...prev, [med.id]: med.indications[0]?.id ?? "" };
    });
    setQuery("");
    setAddMedicationId("");
  }

  function removeMedication(medicationId: string) {
    setSelectedMedicationIds((prev) => prev.filter((id) => id !== medicationId));
    setIndicationByMedication((prev) => {
      const next = { ...prev };
      delete next[medicationId];
      return next;
    });
  }

  function setMedicationIndication(medicationId: string, nextIndicationId: string) {
    setIndicationByMedication((prev) => ({ ...prev, [medicationId]: nextIndicationId }));
  }

  function resetMedicationSelection() {
    setSelectedMedicationIds([]);
    setIndicationByMedication({});
    setQuery("");
    setAddMedicationId("");
  }

  const selectedMedications = useMemo(
    () =>
      selectedMedicationIds
        .map((id) => DOSEID_MEDICATIONS.find((med) => med.id === id))
        .filter(Boolean) as (typeof DOSEID_MEDICATIONS)[number][],
    [selectedMedicationIds]
  );

  const searchSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DOSEID_MEDICATIONS.filter(
      (med) => med.name.toLowerCase().includes(q) && !selectedMedicationIds.includes(med.id)
    ).slice(0, 8);
  }, [query, selectedMedicationIds]);

  const availableMedsInCategory = useMemo(
    () => medsInCategory.filter((med) => !selectedMedicationIds.includes(med.id)),
    [medsInCategory, selectedMedicationIds]
  );

  const catalogMeds = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    return DOSEID_MEDICATIONS.filter(
      (med) => med.category === catalogCategory && !selectedMedicationIds.includes(med.id)
    ).filter((med) => (q ? med.name.toLowerCase().includes(q) : true));
  }, [catalogCategory, catalogQuery, selectedMedicationIds]);

  useEffect(() => {
    if (!catalogOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCatalogOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [catalogOpen]);

  const validation = useMemo(() => {
    const age = Number(ageYears);
    const weight = Number(weightValue);
    const scr = Number(serumCreatinine);

    let height = 0;
    if (heightMode === "cm") {
      height = Number(heightCm);
    } else {
      const ft = Number(heightFt);
      const inches = Number(heightIn);
      height = toCmFromImperial(ft, inches);
    }

    if (!Number.isFinite(age) || age < 18 || age > 120) {
      return { ok: false as const, message: "Enter adult age between 18 and 120 years." };
    }
    if (!Number.isFinite(weight) || weight <= 0) {
      return { ok: false as const, message: "Enter a valid weight value." };
    }
    if (!Number.isFinite(height) || height <= 0) {
      return { ok: false as const, message: "Enter a valid height value." };
    }
    if (renalMode === "standard" && (!Number.isFinite(scr) || scr <= 0)) {
      return { ok: false as const, message: "Enter a valid serum creatinine (mg/dL)." };
    }

    return {
      ok: true as const,
      payload: {
        ageYears: age,
        sex,
        totalBodyWeightKg: toKg(weight, weightUnit),
        heightCm: heightMode === "cm" ? toCmFromMetric(height) : height,
        serumCreatinineMgDl: Number.isFinite(scr) && scr > 0 ? scr : 1,
      },
    };
  }, [
    ageYears,
    sex,
    weightValue,
    weightUnit,
    heightMode,
    heightCm,
    heightFt,
    heightIn,
    serumCreatinine,
    renalMode,
  ]);

  const normalized = useMemo(() => {
    if (!validation.ok) return null;
    return normalizePatient(validation.payload);
  }, [validation]);

  const doseEntries = useMemo(() => {
    if (!normalized) return [];
    return selectedMedications
      .map((med) => {
        const indication =
          med.indications.find((ind) => ind.id === indicationByMedication[med.id]) ??
          med.indications[0];
        if (!indication) return null;
        return {
          medication: med,
          indication,
          result: med.calculate(normalized, {
            indicationId: indication.id,
            renalMode,
          }),
        };
      })
      .filter(Boolean) as Array<{
      medication: (typeof DOSEID_MEDICATIONS)[number];
      indication: { id: string; label: string };
      result: ReturnType<(typeof DOSEID_MEDICATIONS)[number]["calculate"]>;
    }>;
  }, [normalized, selectedMedications, indicationByMedication, renalMode]);

  return (
    <div className="mx-auto max-w-5xl py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">DoseID</h1>
      <p className="mt-3 max-w-3xl text-gray-700">
        A reference app for facilitating antimicrobial dosing for providers.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Medication</h2>
            <button
              type="button"
              onClick={resetMedicationSelection}
              className="text-sm text-gray-600 underline hover:text-gray-900"
            >
              Reset
            </button>
          </div>

          <label className="mt-4 block text-sm font-medium text-gray-700">Class</label>
          <select
            value={category}
            onChange={(e) => {
              const nextCategory = e.target.value as MedicationCategory;
              setCategory(nextCategory);
            }}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {CATEGORY_ORDER.map((cat) => (
              <option key={cat} value={cat}>
                {DOSEID_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-medium text-gray-700">Medication</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchSuggestions[0]) {
                  addMedication(searchSuggestions[0].id);
                }
              }}
              placeholder="Search medication..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                setCatalogCategory(category);
                setCatalogQuery("");
                setCatalogOpen(true);
              }}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
            >
              Catalog
            </button>
          </div>

          {searchSuggestions.length > 0 && (
            <div className="mt-2 rounded-lg border border-gray-200 bg-white p-2">
              {searchSuggestions.map((med) => (
                <button
                  key={med.id}
                  type="button"
                  onClick={() => addMedication(med.id)}
                  className="w-full rounded-md px-2 py-2 text-left hover:bg-gray-50"
                >
                  <p className="text-sm font-medium text-gray-900">{med.name}</p>
                  <p className="text-xs text-gray-700">{DOSEID_CATEGORY_LABELS[med.category]}</p>
                </button>
              ))}
            </div>
          )}

          <label className="mt-4 block text-sm font-medium text-gray-700">Add from selected class</label>
          <select
            value={addMedicationId}
            onChange={(e) => {
              const next = e.target.value;
              if (!next) return;
              addMedication(next);
            }}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select medication...</option>
            {availableMedsInCategory.map((med) => (
              <option key={med.id} value={med.id}>
                {med.name}
              </option>
            ))}
          </select>

          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-sm font-semibold text-gray-900">Selected medications</p>
            {selectedMedications.length === 0 ? (
              <p className="mt-2 text-sm text-gray-700">No medications selected.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {selectedMedications.map((med) => {
                  const currentIndication = indicationIdForMedication(med.id);
                  return (
                    <div key={med.id} className="rounded-lg border border-gray-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">{med.name}</p>
                        <button
                          type="button"
                          onClick={() => removeMedication(med.id)}
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      </div>
                      <label className="mt-2 block text-xs font-medium text-gray-700">Indication</label>
                      <select
                        value={currentIndication}
                        onChange={(e) => setMedicationIndication(med.id, e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        {med.indications.map((ind) => (
                          <option key={ind.id} value={ind.id}>
                            {ind.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900">Patient Inputs</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Age (years)</label>
              <input
                type="number"
                min={18}
                max={120}
                value={ageYears}
                onChange={(e) => setAgeYears(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Sex <span className="ml-1 text-xs font-normal text-gray-500">(for CG equation)</span>
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as BioSex)}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Weight</label>
              <div className="mt-2 space-y-2">
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Height</label>
              <div className="mt-2 space-y-2">
                <select
                  value={heightMode}
                  onChange={(e) => setHeightMode(e.target.value as HeightMode)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="cm">cm</option>
                  <option value="ft_in">ft/in</option>
                </select>

                {heightMode === "cm" ? (
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="ft"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="in"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">Renal function</p>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => setRenalMode("standard")}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-left ${
                  renalMode === "standard"
                    ? "border-gray-900 bg-white text-gray-900"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                Creatinine value
              </button>
              <button
                type="button"
                onClick={() => setRenalMode("ihd")}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-left ${
                  renalMode === "ihd"
                    ? "border-gray-900 bg-white text-gray-900"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                Intermittent HD (iHD)
              </button>
              <button
                type="button"
                onClick={() => setRenalMode("crrt")}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-left ${
                  renalMode === "crrt"
                    ? "border-gray-900 bg-white text-gray-900"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                CRRT
              </button>
            </div>

            {renalMode === "standard" && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">Serum creatinine (mg/dL)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={serumCreatinine}
                  onChange={(e) => setSerumCreatinine(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          {!validation.ok && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {validation.message}
            </div>
          )}
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900">Recommendation</h2>

          {!normalized || doseEntries.length === 0 ? (
            <p className="mt-3 text-sm text-gray-700">Complete the required fields to calculate a dose.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {doseEntries.map((entry) => (
                <div key={entry.medication.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="rounded-md border border-gray-200 bg-white px-3 py-2 text-lg font-semibold text-gray-900">
                    {entry.medication.name} {entry.result.regimen}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">Indication: {entry.indication.label}</p>
                  {renalMode === "standard" ? (
                    <p className="mt-1 text-sm text-gray-700">
                      CrCl (Cockcroft-Gault): {format1(normalized.crclMlMin)} mL/min
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-700">
                      CrCl not used for selected renal replacement pathway.
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-700">{entry.result.renalBucket}</p>
                  {entry.result.doseWeight && (
                    <p className="mt-1 text-sm text-gray-700">
                      Dosing weight: {weightBasisLabel(entry.result.doseWeight.basis)} ({format1(entry.result.doseWeight.kg)} kg)
                    </p>
                  )}
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-900">Clinical notes</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {entry.result.notes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              {renalMode !== "standard" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Dialysis and CRRT pathways are teaching templates and should be confirmed against local protocols before order entry.
                </div>
              )}

              <div className="grid gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                  <p className="font-medium text-gray-900">TBW</p>
                  <p className="mt-1 text-gray-700">{format1(normalized.totalBodyWeightKg)} kg</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                  <p className="font-medium text-gray-900">IBW</p>
                  <p className="mt-1 text-gray-700">{format1(normalized.ibwKg)} kg</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                  <p className="font-medium text-gray-900">AdjBW</p>
                  <p className="mt-1 text-gray-700">{format1(normalized.adjbwKg)} kg</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                  <p className="font-medium text-gray-900">LBW</p>
                  <p className="mt-1 text-gray-700">{format1(normalized.lbwKg)} kg</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                  <p className="font-medium text-gray-900">BMI</p>
                  <p className="mt-1 text-gray-700">{format1(normalized.bmi)} kg/m2</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                  <p className="font-medium text-gray-900">Cockcroft-Gault CrCl</p>
                  {renalMode === "standard" ? (
                    <>
                      <p className="mt-1 text-gray-700">{format1(normalized.crclMlMin)} mL/min</p>
                      <p className="mt-1 text-xs text-gray-700">CG weight used: {format1(normalized.crclWeightKg)} kg</p>
                    </>
                  ) : (
                    <p className="mt-1 text-gray-700">Not used for selected renal replacement pathway</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-700">
        Educational content only. Not medical advice.{" "}
        <Link
          href="/tools/doseid/references"
          className="underline decoration-gray-400 underline-offset-2 hover:text-gray-900"
        >
          See references & methodology.
        </Link>
      </div>

      {catalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Medication catalog">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setCatalogOpen(false)}
            aria-label="Close catalog"
          />

          <div className="relative z-10 flex h-[640px] max-h-[80vh] w-[min(980px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-4">
              <div className="min-w-0">
                <div className="text-lg font-semibold text-gray-900">Browse medication catalog</div>
                <div className="mt-1 text-sm text-gray-700">
                  Search and pick medications by antimicrobial class (Esc to close).
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCatalogOpen(false)}
                className="shrink-0 rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="flex min-h-0 flex-1">
              <aside className="w-56 border-r border-gray-200 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">Classes</div>
                <div className="mt-3 space-y-1">
                  {CATEGORY_ORDER.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCatalogCategory(cat)}
                      className={`w-full rounded-md px-2 py-2 text-left text-sm ${
                        catalogCategory === cat
                          ? "bg-gray-50 font-medium text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {DOSEID_CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </aside>

              <div className="min-h-0 flex-1 p-4">
                <label className="text-sm font-medium text-gray-700">Search in catalog</label>
                <input
                  value={catalogQuery}
                  onChange={(e) => setCatalogQuery(e.target.value)}
                  placeholder="Search medication..."
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />

                <div className="mt-4 h-[calc(100%-4.5rem)] overflow-y-auto pr-1">
                  <div className="space-y-2">
                    {catalogMeds.length === 0 ? (
                      <p className="text-sm text-gray-700">No medications match this search.</p>
                    ) : (
                      catalogMeds.map((med) => (
                        <button
                          key={med.id}
                          type="button"
                          onClick={() => {
                            addMedication(med.id);
                          }}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-left hover:bg-gray-50"
                        >
                          <p className="text-sm font-medium text-gray-900">{med.name}</p>
                          <p className="mt-1 text-xs text-gray-700">
                            {med.indications.map((ind) => ind.label).join(" • ")}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
