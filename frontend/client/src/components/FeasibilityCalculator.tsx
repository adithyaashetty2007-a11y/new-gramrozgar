// @ts-nocheck
import { useState } from "react";
import {
  Calculator,
  IndianRupee,
  CheckCircle2,
  Landmark,
  Wallet,
  CreditCard,
  X,
  Sparkles,
} from "lucide-react";

export default function FeasibilityCalculator() {
  const [enterpriseType, setEnterpriseType] = useState("Dairy Farm");
  const [projectCost, setProjectCost] = useState(200000);
  const [showResult, setShowResult] = useState(false);

  const ownMargin = Math.round(projectCost * 0.1);
  const governmentSubsidy = Math.round(projectCost * 0.35);
  const bankLoan = Math.max(0, projectCost - ownMargin - governmentSubsidy);
  const estimatedEMI =
    bankLoan > 0 ? Math.round((bankLoan / 110000) * 2350) : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);

  const handleCostChange = (e) => {
    const value = Number(e.target.value);
    setProjectCost(Number.isNaN(value) ? 0 : Math.max(0, value));
    setShowResult(false);
  };

  return (
    <section className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-amber-50 p-3">
          <Calculator size={22} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Feasibility & Subsidy Calculator
          </h2>
          <p className="text-sm text-slate-500">
            Estimate project funding for your rural enterprise
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Enterprise Type
          </span>
          <select
            value={enterpriseType}
            onChange={(e) => {
              setEnterpriseType(e.target.value);
              setShowResult(false);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
          >
            <option>Dairy Farm</option>
            <option>Poultry Unit</option>
            <option>Food Processing</option>
            <option>Handicraft Unit</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Project Cost
          </span>
          <div className="mt-2 flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-emerald-500">
            <IndianRupee size={17} className="text-slate-400" />
            <input
              type="number"
              min="0"
              value={projectCost}
              onChange={handleCostChange}
              className="w-full bg-transparent px-2 py-3 text-sm outline-none"
            />
          </div>
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Wallet size={16} />
            Own Margin
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">
            ₹{formatCurrency(ownMargin)}
          </p>
          <p className="mt-1 text-xs text-slate-500">10% of project cost</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <Landmark size={16} />
            Govt Subsidy (PMEGP)
          </div>
          <p className="mt-2 text-xl font-bold text-emerald-700">
            ₹{formatCurrency(governmentSubsidy)}
          </p>
          <p className="mt-1 text-xs text-emerald-600">Prototype assumption: 35%</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <CreditCard size={16} />
            Net Bank Loan
          </div>
          <p className="mt-2 text-xl font-bold text-blue-700">
            ₹{formatCurrency(bankLoan)}
          </p>
          <p className="mt-1 text-xs text-blue-600">After margin + subsidy</p>
        </div>

        <div className="rounded-2xl bg-violet-50 p-4">
          <div className="flex items-center gap-2 text-sm text-violet-700">
            <IndianRupee size={16} />
            Estimated EMI
          </div>
          <p className="mt-2 text-xl font-bold text-violet-700">
            ₹{formatCurrency(estimatedEMI)}/month
          </p>
          <p className="mt-1 text-xs text-violet-600">Prototype estimate</p>
        </div>
      </div>

      <button
        onClick={() => setShowResult(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        <Sparkles size={17} />
        Evaluate Feasibility
      </button>

      {showResult && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
          <div className="flex-1">
            <p className="font-bold text-emerald-800">Feasibility evaluated</p>
            <p className="mt-1 text-sm text-emerald-700">
              {enterpriseType} has a prototype financing estimate of ₹
              {formatCurrency(bankLoan)} bank loan with an estimated EMI of ₹
              {formatCurrency(estimatedEMI)} per month.
            </p>
          </div>
          <button
            onClick={() => setShowResult(false)}
            className="text-emerald-700"
            aria-label="Close result"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </section>
  );
}
