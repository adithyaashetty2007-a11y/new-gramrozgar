import { useEffect, useState } from "react";
import VillageMap from "./components/VillageMap";

import {
  Mic,
  MicOff,
  Calculator,
  ShieldCheck,
  Languages,
  IndianRupee,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

function App() {
  // ================================
  // VOICE STATE
  // ================================

  const [voiceState, setVoiceState] = useState("idle");

  // idle → listening → processing → transcribed

  useEffect(() => {
    if (voiceState !== "listening") return;

    const timer = setTimeout(() => {
      setVoiceState("processing");
    }, 3000);

    return () => clearTimeout(timer);
  }, [voiceState]);

  useEffect(() => {
    if (voiceState !== "processing") return;

    const timer = setTimeout(() => {
      setVoiceState("transcribed");
    }, 2000);

    return () => clearTimeout(timer);
  }, [voiceState]);

  const handleVoiceClick = () => {
    if (voiceState === "processing") return;

    if (voiceState === "transcribed") {
      setVoiceState("listening");
      return;
    }

    setVoiceState("listening");
  };

  // ================================
  // CALCULATOR
  // ================================

  const [projectCost, setProjectCost] = useState(200000);
  const [ownMargin, setOwnMargin] = useState(20000);

  const subsidy = 70000;

  const loanAmount = Math.max(
    projectCost - ownMargin - subsidy,
    0
  );

  const estimatedEMI = Math.round(
    loanAmount * 0.02136
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ================================
  // VOICE DISPLAY
  // ================================

  let voiceTitle = "Tap to Speak Question";
  let voiceSubtitle = "Ask about starting a rural enterprise";
  let voiceBadge = "Ready";
  let badgeClass = "bg-slate-100 text-slate-600";
  let micClass = "bg-blue-600";

  if (voiceState === "listening") {
    voiceTitle = "Listening...";
    voiceSubtitle = "Speak your question clearly";
    voiceBadge = "Recording Audio";
    badgeClass = "bg-red-50 text-red-600";
    micClass = "bg-red-500";
  }

  if (voiceState === "processing") {
    voiceTitle = "Processing...";
    voiceSubtitle = "Converting your voice into a question";
    voiceBadge = "Processing Audio";
    badgeClass = "bg-amber-50 text-amber-700";
    micClass = "bg-amber-500";
  }

  if (voiceState === "transcribed") {
    voiceTitle = "Question Transcribed";
    voiceSubtitle = "Your voice input has been processed";
    voiceBadge = "Audio Transcribed";
    badgeClass = "bg-emerald-50 text-emerald-700";
    micClass = "bg-emerald-500";
  }

  // ================================
  // UI
  // ================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ============================
          HEADER
      ============================ */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-blue-600">
              GramRozgar AI
            </h1>

            <p className="text-xs text-slate-500">
              Rural Enterprise Decision Support
            </p>
          </div>

          <div className="hidden text-center md:block">
            <p className="text-xs font-medium text-slate-700">
              Village: Belthangady, Dakshina Kannada
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm"
          >
            <Languages size={15} />
            ಕನ್ನಡ | मराठी | EN
          </button>

        </div>
      </header>

      {/* ============================
          MAIN
      ============================ */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* ==========================
            VOICE ASSISTANT
        ========================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Voice Assistant
            </p>
          </div>

          <div className="flex flex-col items-center justify-center px-6 py-10">

            {/* MICROPHONE */}

            <button
              type="button"
              onClick={handleVoiceClick}
              disabled={voiceState === "processing"}
              className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 ${micClass} ${
                voiceState === "listening"
                  ? "animate-pulse ring-8 ring-red-100"
                  : ""
              }`}
            >

              {voiceState === "processing" ? (
                <LoaderCircle
                  size={28}
                  className="animate-spin"
                />
              ) : voiceState === "listening" ? (
                <MicOff size={28} />
              ) : (
                <Mic size={28} />
              )}

            </button>

            {/* TITLE */}

            <h2 className="mt-5 text-lg font-bold">
              {voiceTitle}
            </h2>

            {/* QUESTION / SUBTITLE */}

            <p className="mt-2 text-center text-sm text-slate-500">

              {voiceState === "listening"
                ? "Listening to your voice..."
                : voiceState === "processing"
                ? "Please wait while we process your audio..."
                : '"ನಮ್ಮ ಊರಲ್ಲಿ ಡೈರಿ ಫಾರ್ಮ್ ಮಾಡಬಹುದಾ?"'}

            </p>

            {/* STATUS */}

            <div className="mt-4 flex flex-wrap justify-center gap-2">

              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${badgeClass}`}
              >

                {voiceState === "processing" ? (
                  <LoaderCircle
                    size={12}
                    className="animate-spin"
                  />
                ) : voiceState === "transcribed" ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <Mic size={12} />
                )}

                {voiceBadge}

              </span>

              {(voiceState === "idle" ||
                voiceState === "transcribed") && (
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  Intent: Dairy Unit
                </span>
              )}

            </div>

            {/* PROCESSING MESSAGE */}

            {voiceState === "processing" && (
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">

                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />

                Analyzing voice input...

              </div>
            )}

            {/* TRANSCRIBED MESSAGE */}

            {voiceState === "transcribed" && (
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">

                <CheckCircle2 size={14} />

                Voice successfully transcribed

              </div>
            )}

          </div>

        </section>

        {/* ==========================
            MAP + CALCULATOR
        ========================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* MAP */}

          <VillageMap />

          {/* ========================
              CALCULATOR
          ======================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-start gap-3">

              <div className="rounded-xl bg-emerald-50 p-3">
                <Calculator
                  size={22}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Feasibility & Subsidy Calculator
                </h2>

                <p className="text-sm text-slate-500">
                  Estimate the financial requirement
                </p>
              </div>

            </div>

            {/* ENTERPRISE */}

            <label className="text-xs font-medium text-slate-600">
              Enterprise Type
            </label>

            <select
              defaultValue="Dairy Farm"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option>Dairy Farm</option>
              <option>Poultry Farm</option>
              <option>Food Processing</option>
              <option>Handicraft Unit</option>
              <option>Small Retail Shop</option>
            </select>

            {/* PROJECT COST */}

            <div className="mt-4">

              <label className="text-xs font-medium text-slate-600">
                Total Project Cost
              </label>

              <div className="relative mt-2">

                <IndianRupee
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  value={projectCost}
                  onChange={(e) =>
                    setProjectCost(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none focus:border-blue-500"
                />

              </div>

            </div>

            {/* MARGIN + SUBSIDY */}

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Own Margin
                </p>

                <input
                  type="number"
                  value={ownMargin}
                  onChange={(e) =>
                    setOwnMargin(Number(e.target.value))
                  }
                  className="mt-2 w-full bg-transparent text-base font-bold outline-none"
                />

                <p className="text-xs text-slate-400">
                  {projectCost > 0
                    ? Math.round(
                        (ownMargin / projectCost) * 100
                      )
                    : 0}
                  %
                </p>

              </div>

              <div className="rounded-2xl bg-slate-50 p-4">

                <p className="text-xs text-slate-500">
                  Government Subsidy
                </p>

                <p className="mt-2 text-base font-bold">
                  {formatCurrency(subsidy)}
                </p>

                <p className="text-xs text-slate-400">
                  PMEGP
                </p>

              </div>

            </div>

            {/* LOAN */}

            <div className="mt-4 rounded-2xl bg-blue-50 p-5">

              <p className="text-xs font-medium text-blue-700">
                Net Bank Loan Needed
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-700">
                {formatCurrency(loanAmount)}
              </p>

            </div>

            {/* EMI */}

            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">

              <span className="text-xs text-slate-500">
                Estimated Monthly EMI
              </span>

              <span className="text-sm font-bold">
                {formatCurrency(estimatedEMI)} / month
              </span>

            </div>

            {/* BUTTON */}

            <button
              type="button"
              onClick={() =>
                alert(
                  `Estimated loan requirement: ${formatCurrency(
                    loanAmount
                  )}`
                )
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >

              <Calculator size={16} />

              Evaluate Feasibility

            </button>

          </section>

        </div>

        {/* ==========================
            SHIELD GUARANTEE
        ========================== */}

        <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

              <ShieldCheck
                size={23}
                className="text-emerald-600"
              />

            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-base font-bold text-emerald-900">
                  Shield Guarantee
                </h2>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  Favorable Evidence
                </span>

              </div>

              <p className="mt-2 text-sm text-emerald-800">
                High local demand detected within 3km.
                Safe debt ratio. Zero hallucinated claims.
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">

              <CheckCircle2
                size={16}
                className="text-emerald-600"
              />

              <span className="text-xs font-semibold text-emerald-700">
                Evidence Verified
              </span>

            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="py-8 text-center">

          <p className="text-xs text-slate-400">
            GramRozgar AI • Evidence-based rural enterprise
            decision support
          </p>

        </footer>

      </main>

    </div>
  );
}

export default App;