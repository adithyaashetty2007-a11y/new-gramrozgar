import { useState } from "react";

import {
  Calculator,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";


// ============================================================
// FEASIBILITY CALCULATOR
// ============================================================

function FeasibilityCalculator() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [enterpriseType, setEnterpriseType] = useState("Dairy Farm");

  const [projectCost, setProjectCost] = useState(200000);

  const [showResult, setShowResult] = useState(false);


  // ==========================================================
  // CALCULATION RULES
  // ==========================================================

  // Own contribution = 10%
  const ownMargin = Math.round(projectCost * 0.10);

  // Government subsidy = 35%
  const governmentSubsidy = Math.round(projectCost * 0.35);

  // Bank loan = remaining amount
  const bankLoan = Math.max(
    0,
    projectCost - ownMargin - governmentSubsidy
  );


  // ==========================================================
  // EMI ESTIMATION
  // ==========================================================

  // Prototype reference:
  // ₹1,10,000 loan ≈ ₹2,350/month

  const estimatedEMI =
    bankLoan > 0
      ? Math.round((bankLoan / 110000) * 2350)
      : 0;


  // ==========================================================
  // CURRENCY FORMATTER
  // ==========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };


  // ==========================================================
  // HANDLE PROJECT COST
  // ==========================================================

  const handleProjectCostChange = (event) => {

    const value = Number(event.target.value);

    if (Number.isNaN(value)) {
      setProjectCost(0);
      setShowResult(false);
      return;
    }

    setProjectCost(Math.max(0, value));

    // Hide previous result when value changes
    setShowResult(false);
  };


  // ==========================================================
  // EVALUATE
  // ==========================================================

  const handleEvaluate = () => {

    // IMPORTANT:
    // No alert()
    // Result is shown directly inside the UI.

    setShowResult(true);
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">

          <Calculator size={22} />

        </div>


        <div>

          <h2 className="font-bold text-slate-900">
            Feasibility & Subsidy Calculator
          </h2>

          <p className="text-sm text-slate-500">
            Estimate the financial requirement
          </p>

        </div>

      </div>


      {/* ====================================================
          FORM
      ==================================================== */}

      <div className="mt-6 space-y-5">


        {/* ==================================================
            ENTERPRISE TYPE
        ================================================== */}

        <div>

          <label
            htmlFor="enterpriseType"
            className="text-sm font-medium text-slate-600"
          >
            Enterprise Type
          </label>


          <select
            id="enterpriseType"
            value={enterpriseType}
            onChange={(event) => {
              setEnterpriseType(event.target.value);
              setShowResult(false);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >

            <option value="Dairy Farm">
              Dairy Farm
            </option>

            <option value="Poultry Farm">
              Poultry Farm
            </option>

            <option value="Goat Farming">
              Goat Farming
            </option>

            <option value="Food Processing">
              Food Processing
            </option>

            <option value="Small Retail Shop">
              Small Retail Shop
            </option>

          </select>

        </div>


        {/* ==================================================
            PROJECT COST
        ================================================== */}

        <div>

          <label
            htmlFor="projectCost"
            className="text-sm font-medium text-slate-600"
          >
            Total Project Cost
          </label>


          <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

            <IndianRupee
              size={17}
              className="mr-2 text-slate-400"
            />


            <input
              id="projectCost"
              type="number"
              min="0"
              value={projectCost}
              onChange={handleProjectCostChange}
              className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none"
              placeholder="Enter project cost"
            />

          </div>

        </div>


        {/* ==================================================
            OWN MARGIN + SUBSIDY
        ================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


          {/* OWN MARGIN */}

          <div className="rounded-2xl bg-slate-50 p-4">

            <p className="text-xs font-medium text-slate-500">
              Own Margin
            </p>


            <p className="mt-2 text-lg font-bold text-slate-900">
              ₹{formatCurrency(ownMargin)}
            </p>


            <p className="mt-1 text-xs text-slate-400">
              10%
            </p>

          </div>


          {/* GOVERNMENT SUBSIDY */}

          <div className="rounded-2xl bg-slate-50 p-4">

            <p className="text-xs font-medium text-slate-500">
              Government Subsidy
            </p>


            <p className="mt-2 text-lg font-bold text-slate-900">
              ₹{formatCurrency(governmentSubsidy)}
            </p>


            <p className="mt-1 text-xs text-slate-400">
              PMEGP
            </p>

          </div>

        </div>


        {/* ==================================================
            BANK LOAN
        ================================================== */}

        <div className="rounded-2xl bg-blue-50 p-5">

          <p className="text-xs font-medium text-blue-600">
            Net Bank Loan Needed
          </p>


          <div className="mt-1 flex items-center gap-1">

            <IndianRupee
              size={20}
              className="text-blue-700"
            />

            <span className="text-2xl font-extrabold text-blue-700">
              {formatCurrency(bankLoan)}
            </span>

          </div>

        </div>


        {/* ==================================================
            EMI
        ================================================== */}

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">

          <div>

            <p className="text-xs font-medium text-slate-500">
              Estimated Monthly EMI
            </p>

          </div>


          <p className="text-sm font-bold text-slate-900">
            ₹{formatCurrency(estimatedEMI)} / month
          </p>

        </div>


        {/* ==================================================
            EVALUATE BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={handleEvaluate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
        >

          <TrendingUp size={17} />

          Evaluate Feasibility

        </button>


        {/* ==================================================
            RESULT
        ================================================== */}

        {showResult && (

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">

                <CheckCircle2
                  size={20}
                  className="text-emerald-600"
                />

              </div>


              <div className="min-w-0">

                <p className="font-bold text-emerald-800">
                  Feasibility Evaluated
                </p>


                <p className="mt-1 text-sm text-emerald-700">
                  {enterpriseType} requires an estimated bank loan of{" "}
                  <span className="font-bold">
                    ₹{formatCurrency(bankLoan)}
                  </span>
                  .
                </p>


                <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">

                  <div className="rounded-lg bg-white px-3 py-2">

                    <p className="text-slate-400">
                      Own Margin
                    </p>

                    <p className="mt-1 font-bold text-slate-700">
                      ₹{formatCurrency(ownMargin)}
                    </p>

                  </div>


                  <div className="rounded-lg bg-white px-3 py-2">

                    <p className="text-slate-400">
                      Subsidy
                    </p>

                    <p className="mt-1 font-bold text-slate-700">
                      ₹{formatCurrency(governmentSubsidy)}
                    </p>

                  </div>


                  <div className="rounded-lg bg-white px-3 py-2">

                    <p className="text-slate-400">
                      EMI
                    </p>

                    <p className="mt-1 font-bold text-slate-700">
                      ₹{formatCurrency(estimatedEMI)}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </section>

  );
}


export default FeasibilityCalculator;