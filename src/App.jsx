import { useState, useCallback, useEffect } from "react";

const translations = {
  ro: {
    title: "Comparație: Cumpăr vs. Chirie",
    mainParams: "PARAMETRI PRINCIPALI",
    realCosts: "COSTURI REALE",
    aptAndRent: "APARTAMENTE & CHIRIE",
    modelIncludes: "CE INCLUDE MODELUL",
    downPayment: "Avans disponibil (€)",
    monthlyBudget: "Buget lunar total (€)",
    analysisHorizon: "Orizont analiză (ani)",
    interestRate: "Dobândă credit (%/an)",
    investmentReturn: "Randament investiții (%/an)",
    propertyAppreciation: "Apreciere imobiliară (%/an)",
    rentInflation: "Inflație chirie (%/an)",
    transactionCosts: "Costuri tranzacție cumpărare (%)",
    ownerCosts: "Costuri proprietar (%/an din val. apt)",
    smallAptPrice: "Preț apt. mic (€)",
    smallAptYears: "Ani credit apt. mic",
    largeAptPrice: "Preț apt. mare (€)",
    largeAptYears: "Ani credit apt. mare",
    newRent: "Chirie nouă (€/lună, azi)",
    v1Title: (p) => `V1: Apt. mic (${p}€)`,
    v2Title: (p) => `V2: Apt. mare (${p}€)`,
    v3Title: "V3: Chirie + Investiții",
    v1Desc: (d, t, c) => `Avans ${d}€ + tranzacție ${t}€ + credit ${c}€`,
    v2Desc: (d, t, c) => `Avans ${d}€ + tranzacție ${t}€ + credit ${c}€`,
    v3Desc: (a, e) => `Investești ${a}€ inițial + ${e}€/lună (scade cu inflația chiriei)`,
    monthlyPayment: "Rată lunară:",
    ownerCostsMonthly: "Costuri proprietar/lună:",
    monthlyInvestment: "Investești lunar:",
    interestPaid: "Dobândă plătită:",
    totalOwnerCosts: "Total costuri proprietar:",
    remainingBalance: "Sold rămas credit:",
    aptValueIn: (y) => `Valoare apt. în ${y} ani:`,
    investmentPortfolio: "Portofoliu investiții:",
    netWorth: "Avere netă:",
    initialRent: "Chirie inițială:",
    rentInYear: (y) => `Chirie în anul ${y}:`,
    totalRent: (y) => `Total chirie ${y} ani:`,
    property: "Proprietate:",
    afterYears: (y) => `(după ${y} ani)`,
    perMonth: "/lună",
    note1: (v) => `✅ Inflația chiriei (${v}%/an) – chiria crește anual, scade suma investită lunar în V3`,
    note2: (v) => `✅ Costuri tranzacție (${v}%) – se scad din avans la V1 & V2, cresc creditul necesar`,
    note3: (v) => `✅ Costuri proprietar (${v}%/an) – reparații, impozit, fond rulment – scad investiția lunară la V1 & V2`,
    note4: "✅ Investiții lunare din diferența buget - rată/chirie - costuri",
    note5: "⚠️ Nu include: inflația ratei (dacă dobândă variabilă), impozit pe câștig capital, inflația costurilor proprietar",
  },
  en: {
    title: "Comparison: Buy vs. Rent",
    mainParams: "MAIN PARAMETERS",
    realCosts: "REAL COSTS",
    aptAndRent: "APARTMENTS & RENT",
    modelIncludes: "WHAT THE MODEL INCLUDES",
    downPayment: "Down payment (€)",
    monthlyBudget: "Total monthly budget (€)",
    analysisHorizon: "Analysis horizon (years)",
    interestRate: "Mortgage interest (%/yr)",
    investmentReturn: "Investment return (%/yr)",
    propertyAppreciation: "Property appreciation (%/yr)",
    rentInflation: "Rent inflation (%/yr)",
    transactionCosts: "Transaction costs (%)",
    ownerCosts: "Owner costs (%/yr of apt value)",
    smallAptPrice: "Small apt. price (€)",
    smallAptYears: "Mortgage years (small apt.)",
    largeAptPrice: "Large apt. price (€)",
    largeAptYears: "Mortgage years (large apt.)",
    newRent: "New rent (€/month, today)",
    v1Title: (p) => `V1: Small apt. (${p}€)`,
    v2Title: (p) => `V2: Large apt. (${p}€)`,
    v3Title: "V3: Rent + Invest",
    v1Desc: (d, t, c) => `Down payment ${d}€ + transaction ${t}€ + mortgage ${c}€`,
    v2Desc: (d, t, c) => `Down payment ${d}€ + transaction ${t}€ + mortgage ${c}€`,
    v3Desc: (a, e) => `Invest ${a}€ upfront + ${e}€/month (decreases with rent inflation)`,
    monthlyPayment: "Monthly payment:",
    ownerCostsMonthly: "Owner costs/month:",
    monthlyInvestment: "Monthly investment:",
    interestPaid: "Interest paid:",
    totalOwnerCosts: "Total owner costs:",
    remainingBalance: "Remaining balance:",
    aptValueIn: (y) => `Apt. value in ${y} yrs:`,
    investmentPortfolio: "Investment portfolio:",
    netWorth: "Net worth:",
    initialRent: "Initial rent:",
    rentInYear: (y) => `Rent in year ${y}:`,
    totalRent: (y) => `Total rent ${y} yrs:`,
    property: "Property:",
    afterYears: (y) => `(after ${y} yrs)`,
    perMonth: "/mo",
    note1: (v) => `✅ Rent inflation (${v}%/yr) – rent increases annually, reduces monthly investment in V3`,
    note2: (v) => `✅ Transaction costs (${v}%) – deducted from down payment in V1 & V2, increases mortgage`,
    note3: (v) => `✅ Owner costs (${v}%/yr) – repairs, tax, maintenance – reduce monthly investment in V1 & V2`,
    note4: "✅ Monthly investments from budget minus payment/rent minus costs",
    note5: "⚠️ Not included: variable rate changes, capital gains tax, owner cost inflation",
  },
};

const fmt = (n) => n.toLocaleString("ro-RO", { maximumFractionDigits: 0 });

function calcMortgage(principal, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return { payment: principal / n, totalPaid: principal, totalInterest: 0 };
  const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPaid = payment * n;
  return { payment, totalPaid, totalInterest: totalPaid - principal };
}

function compoundGrowth(principal, annualRate, years) {
  return principal * Math.pow(1 + annualRate / 100, years);
}

function remainingBalance(principal, annualRate, totalYears, yearsPaid) {
  if (yearsPaid >= totalYears) return 0;
  const r = annualRate / 100 / 12;
  const n = totalYears * 12;
  const k = yearsPaid * 12;
  if (r === 0) return principal * (1 - k / n);
  return principal * (Math.pow(1 + r, n) - Math.pow(1 + r, k)) / (Math.pow(1 + r, n) - 1);
}

function totalRentWithInflation(monthlyRent, annualInflation, years) {
  let total = 0;
  for (let y = 0; y < years; y++) {
    total += monthlyRent * Math.pow(1 + annualInflation / 100, y) * 12;
  }
  return total;
}

function rentInvestSimulation(downPayment, monthlyBudget, monthlyRent, rentInflation, investReturn, years) {
  const r = investReturn / 100 / 12;
  let portfolio = downPayment;
  for (let m = 0; m < years * 12; m++) {
    const currentRent = monthlyRent * Math.pow(1 + rentInflation / 100, Math.floor(m / 12));
    portfolio = portfolio * (1 + r) + Math.max(0, monthlyBudget - currentRent);
  }
  return portfolio;
}

function mortgageInvestSimulation(monthlyBudget, payment, mortgageYears, ownerCostMonthly, investReturn, horizon) {
  const r = investReturn / 100 / 12;
  let portfolio = 0;
  for (let m = 0; m < horizon * 12; m++) {
    const currentPayment = Math.floor(m / 12) < mortgageYears ? payment : 0;
    portfolio = portfolio * (1 + r) + Math.max(0, monthlyBudget - currentPayment - ownerCostMonthly);
  }
  return portfolio;
}

export default function App() {
  const defaultInputs = {
    downPayment: "", interestRate: "", investReturn: "", newRent: "",
    smallAptPrice: "", largeAptPrice: "", smallAptYears: "", largeAptYears: "",
    horizon: "", appreciation: "", monthlyBudget: "",
    rentInflation: "", transactionCostPct: "", ownerCostPct: "",
  };

  const [lang, setLang] = useState(() => localStorage.getItem("bvr-lang") || "ro");
  const t = translations[lang];

  const [inputs, setInputs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bvr-inputs"));
      return saved ? { ...defaultInputs, ...saved } : defaultInputs;
    } catch { return defaultInputs; }
  });

  useEffect(() => { localStorage.setItem("bvr-inputs", JSON.stringify(inputs)); }, [inputs]);
  useEffect(() => { localStorage.setItem("bvr-lang", lang); }, [lang]);

  const set = useCallback((key) => (e) => {
    setInputs(prev => ({ ...prev, [key]: e.target.value }));
  }, []);

  const v = (key) => parseFloat(inputs[key]) || 0;

  const downPayment = v("downPayment"), interestRate = v("interestRate"), investReturn = v("investReturn");
  const newRent = v("newRent"), smallAptPrice = v("smallAptPrice"), largeAptPrice = v("largeAptPrice");
  const smallAptYears = v("smallAptYears"), largeAptYears = v("largeAptYears"), horizon = v("horizon");
  const appreciation = v("appreciation"), monthlyBudget = v("monthlyBudget");
  const rentInflation = v("rentInflation"), transactionCostPct = v("transactionCostPct");
  const ownerCostPct = v("ownerCostPct");

  const txCost1 = smallAptPrice * transactionCostPct / 100;
  const txCost2 = largeAptPrice * transactionCostPct / 100;
  const mortgage1 = smallAptPrice - downPayment;
  const mortgage2 = largeAptPrice - downPayment;

  const m1 = calcMortgage(mortgage1, interestRate, smallAptYears);
  const m2 = calcMortgage(mortgage2, interestRate, largeAptYears);

  const balance1 = remainingBalance(mortgage1, interestRate, smallAptYears, horizon);
  const balance2 = remainingBalance(mortgage2, interestRate, largeAptYears, horizon);

  const monthsPaid1 = Math.min(horizon, smallAptYears) * 12;
  const monthsPaid2 = Math.min(horizon, largeAptYears) * 12;
  const interestPaid1 = m1.payment * monthsPaid1 - (mortgage1 - balance1);
  const interestPaid2 = m2.payment * monthsPaid2 - (mortgage2 - balance2);

  const aptValue1 = compoundGrowth(smallAptPrice, appreciation, horizon);
  const aptValue2 = compoundGrowth(largeAptPrice, appreciation, horizon);

  const ownerCostMonthly1 = (smallAptPrice * ownerCostPct / 100) / 12;
  const ownerCostMonthly2 = (largeAptPrice * ownerCostPct / 100) / 12;

  let totalOwnerCost1 = 0, totalOwnerCost2 = 0;
  for (let y = 0; y < horizon; y++) {
    totalOwnerCost1 += compoundGrowth(smallAptPrice, appreciation, y) * ownerCostPct / 100;
    totalOwnerCost2 += compoundGrowth(largeAptPrice, appreciation, y) * ownerCostPct / 100;
  }

  const portfolio1 = mortgageInvestSimulation(monthlyBudget, m1.payment, smallAptYears, ownerCostMonthly1, investReturn, horizon);
  const portfolio2 = mortgageInvestSimulation(monthlyBudget, m2.payment, largeAptYears, ownerCostMonthly2, investReturn, horizon);

  const totalRent = totalRentWithInflation(newRent, rentInflation, horizon);
  const portfolio3 = rentInvestSimulation(downPayment, monthlyBudget, newRent, rentInflation, investReturn, horizon);

  const extraMonthly1 = Math.max(0, monthlyBudget - m1.payment - ownerCostMonthly1);
  const extraMonthly2 = Math.max(0, monthlyBudget - m2.payment - ownerCostMonthly2);
  const extraAfter1 = monthlyBudget - ownerCostMonthly1;
  const extraMonthly3 = Math.max(0, monthlyBudget - newRent);
  const yearsAfterMortgage1 = Math.max(0, horizon - smallAptYears);
  const yearsAfterMortgage2 = Math.max(0, horizon - largeAptYears);

  const nw1 = aptValue1 - balance1 + portfolio1;
  const nw2 = aptValue2 - balance2 + portfolio2;
  const nw3 = portfolio3; // rent already accounted for in reduced monthly investment

  const best = Math.max(nw1, nw2, nw3);
  const highlight = (nw) => nw === best ? "ring-2 ring-yellow-400" : "";

  const ic = "w-full p-2 border border-gray-300 rounded text-sm";
  const lc = "text-xs text-gray-500 mb-1";

  return (
    <div className="bg-gray-50 min-h-screen p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
        <div className="flex gap-1 bg-gray-200 rounded-lg p-0.5">
          <button
            onClick={() => setLang("ro")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${lang === "ro" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >RO</button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${lang === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >EN</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold text-sm text-gray-600 mb-3">{t.mainParams}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div><div className={lc}>{t.downPayment}</div><input type="number" className={ic} value={inputs.downPayment} onChange={set("downPayment")} /></div>
          <div><div className={lc}>{t.monthlyBudget}</div><input type="number" className={ic} value={inputs.monthlyBudget} onChange={set("monthlyBudget")} /></div>
          <div><div className={lc}>{t.analysisHorizon}</div><input type="number" className={ic} value={inputs.horizon} onChange={set("horizon")} /></div>
          <div><div className={lc}>{t.interestRate}</div><input type="number" step="0.1" className={ic} value={inputs.interestRate} onChange={set("interestRate")} /></div>
          <div><div className={lc}>{t.investmentReturn}</div><input type="number" step="0.1" className={ic} value={inputs.investReturn} onChange={set("investReturn")} /></div>
          <div><div className={lc}>{t.propertyAppreciation}</div><input type="number" step="0.1" className={ic} value={inputs.appreciation} onChange={set("appreciation")} /></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold text-sm text-gray-600 mb-3">{t.realCosts}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div><div className={lc}>{t.rentInflation}</div><input type="number" step="0.1" className={ic} value={inputs.rentInflation} onChange={set("rentInflation")} /></div>
          <div><div className={lc}>{t.transactionCosts}</div><input type="number" step="0.1" className={ic} value={inputs.transactionCostPct} onChange={set("transactionCostPct")} /></div>
          <div><div className={lc}>{t.ownerCosts}</div><input type="number" step="0.1" className={ic} value={inputs.ownerCostPct} onChange={set("ownerCostPct")} /></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold text-sm text-gray-600 mb-3">{t.aptAndRent}</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><div className={lc}>{t.smallAptPrice}</div><input type="number" className={ic} value={inputs.smallAptPrice} onChange={set("smallAptPrice")} /></div>
            <div><div className={lc}>{t.smallAptYears}</div><input type="number" className={ic} value={inputs.smallAptYears} onChange={set("smallAptYears")} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className={lc}>{t.largeAptPrice}</div><input type="number" className={ic} value={inputs.largeAptPrice} onChange={set("largeAptPrice")} /></div>
            <div><div className={lc}>{t.largeAptYears}</div><input type="number" className={ic} value={inputs.largeAptYears} onChange={set("largeAptYears")} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className={lc}>{t.newRent}</div><input type="number" className={ic} value={inputs.newRent} onChange={set("newRent")} /></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-blue-500 ${highlight(nw1)}`}>
          <h3 className="font-bold text-blue-700 mb-2">{t.v1Title(fmt(smallAptPrice))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v1Desc(fmt(downPayment), fmt(txCost1), fmt(mortgage1))}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.monthlyPayment}</span><span className="font-semibold">{fmt(m1.payment)}€</span></div>
            <div className="flex justify-between"><span>{t.ownerCostsMonthly}</span><span className="font-semibold text-red-500">{fmt(ownerCostMonthly1)}€</span></div>
            <div className="flex justify-between"><span>{t.monthlyInvestment}</span><span className="font-semibold text-green-600">{fmt(extraMonthly1)}€{yearsAfterMortgage1 > 0 ? ` → ${fmt(extraAfter1)}€ ${t.afterYears(smallAptYears)}` : ""}</span></div>
            <div className="flex justify-between"><span>{t.interestPaid}</span><span className="font-semibold text-red-600">{fmt(interestPaid1)}€</span></div>
            <div className="flex justify-between"><span>{t.totalOwnerCosts}</span><span className="font-semibold text-red-600">{fmt(totalOwnerCost1)}€</span></div>
            <div className="flex justify-between"><span>{t.remainingBalance}</span><span className="font-semibold">{balance1 > 0 ? fmt(balance1) + "€" : "0€ ✓"}</span></div>
            <div className="flex justify-between"><span>{t.aptValueIn(horizon)}</span><span className="font-semibold text-green-600">{fmt(aptValue1)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolio1)}€</span></div>
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-blue-700">{fmt(nw1)}€</span></div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-green-500 ${highlight(nw2)}`}>
          <h3 className="font-bold text-green-700 mb-2">{t.v2Title(fmt(largeAptPrice))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v2Desc(fmt(downPayment), fmt(txCost2), fmt(mortgage2))}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.monthlyPayment}</span><span className="font-semibold">{fmt(m2.payment)}€</span></div>
            <div className="flex justify-between"><span>{t.ownerCostsMonthly}</span><span className="font-semibold text-red-500">{fmt(ownerCostMonthly2)}€</span></div>
            <div className="flex justify-between"><span>{t.monthlyInvestment}</span><span className="font-semibold text-green-600">{fmt(extraMonthly2)}€{yearsAfterMortgage2 > 0 ? ` → ${fmt(monthlyBudget - ownerCostMonthly2)}€ ${t.afterYears(largeAptYears)}` : ""}</span></div>
            <div className="flex justify-between"><span>{t.interestPaid}</span><span className="font-semibold text-red-600">{fmt(interestPaid2)}€</span></div>
            <div className="flex justify-between"><span>{t.totalOwnerCosts}</span><span className="font-semibold text-red-600">{fmt(totalOwnerCost2)}€</span></div>
            <div className="flex justify-between"><span>{t.remainingBalance}</span><span className="font-semibold">{balance2 > 0 ? fmt(balance2) + "€" : "0€ ✓"}</span></div>
            <div className="flex justify-between"><span>{t.aptValueIn(horizon)}</span><span className="font-semibold text-green-600">{fmt(aptValue2)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolio2)}€</span></div>
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-green-700">{fmt(nw2)}€</span></div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-orange-500 ${highlight(nw3)}`}>
          <h3 className="font-bold text-orange-700 mb-2">{t.v3Title}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v3Desc(fmt(downPayment), fmt(extraMonthly3))}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.initialRent}</span><span className="font-semibold">{fmt(newRent)}€{t.perMonth}</span></div>
            <div className="flex justify-between"><span>{t.rentInYear(horizon)}</span><span className="font-semibold text-red-500">{fmt(newRent * Math.pow(1 + rentInflation / 100, Math.max(0, horizon - 1)))}€{t.perMonth}</span></div>
            <div className="flex justify-between"><span>{t.totalRent(horizon)}</span><span className="font-semibold text-red-600">{fmt(totalRent)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolio3)}€</span></div>
            <div className="flex justify-between"><span>{t.property}</span><span className="font-semibold text-gray-400">0€</span></div>
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-orange-700">{fmt(nw3)}€</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold text-sm text-gray-600 mb-2">{t.modelIncludes}</h2>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>{t.note1(rentInflation)}</li>
          <li>{t.note2(transactionCostPct)}</li>
          <li>{t.note3(ownerCostPct)}</li>
          <li>{t.note4}</li>
          <li>{t.note5}</li>
        </ul>
      </div>
    </div>
  );
}
