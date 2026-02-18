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
    moveOutYears: "Ani până dau în chirie apt. mic",
    rentalIncome: "Chirie primită apt. mic (€/lună)",
    v1Title: (p) => `V1: Apt. mic (${p}€)`,
    v2Title: (p) => `V2: Cumpăr mic (${p}€), dau în chirie`,
    v3Title: (p) => `V3: Apt. mare (${p}€)`,
    v4Title: "V4: Chirie + Investiții",
    v1Desc: (d, t, c) => `Avans ${d}€ + tranzacție ${t}€ + credit ${c}€`,
    v2Desc: (d, t, c, y, r) => `Avans ${d}€ + tranzacție ${t}€ + credit ${c}€ · după ${y} ani: dau în chirie (${r}€) și mă mut`,
    v3Desc: (d, t, c) => `Avans ${d}€ + tranzacție ${t}€ + credit ${c}€`,
    v4Desc: (a, e) => `Investești ${a}€ inițial + ${e}€/lună (scade cu inflația chiriei)`,
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
    rentalIncomeLabel: "Venit din chirie:",
    rentPaidLabel: "Chirie plătită:",
    property: "Proprietate:",
    afterYears: (y) => `(după ${y} ani)`,
    perMonth: "/lună",
    note1: (v) => `✅ Inflația chiriei (${v}%/an) – chiria crește anual, scade suma investită lunar în V4`,
    note2: (v) => `✅ Costuri tranzacție (${v}%) – cresc creditul necesar`,
    note3: (v) => `✅ Costuri proprietar (${v}%/an) – reparații, impozit, fond rulment – scad investiția lunară`,
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
    moveOutYears: "Years before renting out small apt",
    rentalIncome: "Rental income small apt (€/mo)",
    v1Title: (p) => `V1: Small apt. (${p}€)`,
    v2Title: (p) => `V2: Buy small (${p}€), rent out`,
    v3Title: (p) => `V3: Large apt. (${p}€)`,
    v4Title: "V4: Rent + Invest",
    v1Desc: (d, t, c) => `Down payment ${d}€ + transaction ${t}€ + mortgage ${c}€`,
    v2Desc: (d, t, c, y, r) => `Down payment ${d}€ + transaction ${t}€ + mortgage ${c}€ · after ${y} yrs: rent out (${r}€) and move`,
    v3Desc: (d, t, c) => `Down payment ${d}€ + transaction ${t}€ + mortgage ${c}€`,
    v4Desc: (a, e) => `Invest ${a}€ upfront + ${e}€/month (decreases with rent inflation)`,
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
    rentalIncomeLabel: "Rental income:",
    rentPaidLabel: "Rent paid:",
    property: "Property:",
    afterYears: (y) => `(after ${y} yrs)`,
    perMonth: "/mo",
    note1: (v) => `✅ Rent inflation (${v}%/yr) – rent increases annually, reduces monthly investment in V4`,
    note2: (v) => `✅ Transaction costs (${v}%) – increases mortgage`,
    note3: (v) => `✅ Owner costs (${v}%/yr) – repairs, tax, maintenance – reduce monthly investment`,
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

function buyRentOutSimulation(monthlyBudget, payment, mortgageYears, ownerCostMonthly, rentalIncome, moveOutYears, monthlyRent, rentInflation, investReturn, horizon) {
  const r = investReturn / 100 / 12;
  let portfolio = 0;
  for (let m = 0; m < horizon * 12; m++) {
    const year = Math.floor(m / 12);
    const currentPayment = year < mortgageYears ? payment : 0;
    const movedOut = year >= moveOutYears;
    let monthlyNet = monthlyBudget - currentPayment - ownerCostMonthly;
    if (movedOut) {
      const currentRentalIncome = rentalIncome * Math.pow(1 + rentInflation / 100, year);
      const currentRent = monthlyRent * Math.pow(1 + rentInflation / 100, year);
      monthlyNet += currentRentalIncome - currentRent;
    }
    portfolio = portfolio * (1 + r) + Math.max(0, monthlyNet);
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
    moveOutYears: "", rentalIncome: "",
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
  const moveOutYears = v("moveOutYears"), rentalIncome = v("rentalIncome");

  // V1 & V2: small apt
  const txCostSmall = smallAptPrice * transactionCostPct / 100;
  const mortgageSmall = smallAptPrice + txCostSmall - downPayment;
  const mSmall = calcMortgage(mortgageSmall, interestRate, smallAptYears);
  const balanceSmall = remainingBalance(mortgageSmall, interestRate, smallAptYears, horizon);
  const monthsPaidSmall = Math.min(horizon, smallAptYears) * 12;
  const interestPaidSmall = mSmall.payment * monthsPaidSmall - (mortgageSmall - balanceSmall);
  const aptValueSmall = compoundGrowth(smallAptPrice, appreciation, horizon);
  const ownerCostMonthlySmall = (smallAptPrice * ownerCostPct / 100) / 12;
  let totalOwnerCostSmall = 0;
  for (let y = 0; y < horizon; y++) totalOwnerCostSmall += compoundGrowth(smallAptPrice, appreciation, y) * ownerCostPct / 100;

  // V3: large apt
  const txCostLarge = largeAptPrice * transactionCostPct / 100;
  const mortgageLarge = largeAptPrice + txCostLarge - downPayment;
  const mLarge = calcMortgage(mortgageLarge, interestRate, largeAptYears);
  const balanceLarge = remainingBalance(mortgageLarge, interestRate, largeAptYears, horizon);
  const monthsPaidLarge = Math.min(horizon, largeAptYears) * 12;
  const interestPaidLarge = mLarge.payment * monthsPaidLarge - (mortgageLarge - balanceLarge);
  const aptValueLarge = compoundGrowth(largeAptPrice, appreciation, horizon);
  const ownerCostMonthlyLarge = (largeAptPrice * ownerCostPct / 100) / 12;
  let totalOwnerCostLarge = 0;
  for (let y = 0; y < horizon; y++) totalOwnerCostLarge += compoundGrowth(largeAptPrice, appreciation, y) * ownerCostPct / 100;

  // V1: buy small, live in it
  const portfolioV1 = mortgageInvestSimulation(monthlyBudget, mSmall.payment, smallAptYears, ownerCostMonthlySmall, investReturn, horizon);
  const extraMonthlyV1 = Math.max(0, monthlyBudget - mSmall.payment - ownerCostMonthlySmall);
  const extraAfterV1 = monthlyBudget - ownerCostMonthlySmall;
  const yearsAfterMortgageV1 = Math.max(0, horizon - smallAptYears);

  // V2: buy small, rent it out after moveOutYears, move to rented place
  const portfolioV2 = buyRentOutSimulation(monthlyBudget, mSmall.payment, smallAptYears, ownerCostMonthlySmall, rentalIncome, moveOutYears, newRent, rentInflation, investReturn, horizon);
  const totalRentV2 = totalRentWithInflation(newRent, rentInflation, Math.max(0, horizon - moveOutYears));

  // V3: buy large, live in it
  const portfolioV3 = mortgageInvestSimulation(monthlyBudget, mLarge.payment, largeAptYears, ownerCostMonthlyLarge, investReturn, horizon);
  const extraMonthlyV3 = Math.max(0, monthlyBudget - mLarge.payment - ownerCostMonthlyLarge);
  const yearsAfterMortgageV3 = Math.max(0, horizon - largeAptYears);

  // V4: rent + invest
  const totalRentV4 = totalRentWithInflation(newRent, rentInflation, horizon);
  const portfolioV4 = rentInvestSimulation(downPayment, monthlyBudget, newRent, rentInflation, investReturn, horizon);
  const extraMonthlyV4 = Math.max(0, monthlyBudget - newRent);

  const nw1 = aptValueSmall - balanceSmall + portfolioV1;
  const nw2 = aptValueSmall - balanceSmall + portfolioV2;
  const nw3 = aptValueLarge - balanceLarge + portfolioV3;
  const nw4 = portfolioV4;

  const best = Math.max(nw1, nw2, nw3, nw4);
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><div className={lc}>{t.smallAptPrice}</div><input type="number" className={ic} value={inputs.smallAptPrice} onChange={set("smallAptPrice")} /></div>
            <div><div className={lc}>{t.smallAptYears}</div><input type="number" className={ic} value={inputs.smallAptYears} onChange={set("smallAptYears")} /></div>
            <div><div className={lc}>{t.moveOutYears}</div><input type="number" className={ic} value={inputs.moveOutYears} onChange={set("moveOutYears")} /></div>
            <div><div className={lc}>{t.rentalIncome}</div><input type="number" className={ic} value={inputs.rentalIncome} onChange={set("rentalIncome")} /></div>
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

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-blue-500 ${highlight(nw1)}`}>
          <h3 className="font-bold text-blue-700 mb-2">{t.v1Title(fmt(smallAptPrice))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v1Desc(fmt(downPayment), fmt(txCostSmall), fmt(mortgageSmall))}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.monthlyPayment}</span><span className="font-semibold">{fmt(mSmall.payment)}€</span></div>
            <div className="flex justify-between"><span>{t.ownerCostsMonthly}</span><span className="font-semibold text-red-500">{fmt(ownerCostMonthlySmall)}€</span></div>
            <div className="flex justify-between"><span>{t.monthlyInvestment}</span><span className="font-semibold text-green-600">{fmt(extraMonthlyV1)}€{yearsAfterMortgageV1 > 0 ? ` → ${fmt(extraAfterV1)}€ ${t.afterYears(smallAptYears)}` : ""}</span></div>
            <div className="flex justify-between"><span>{t.interestPaid}</span><span className="font-semibold text-red-600">{fmt(interestPaidSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.totalOwnerCosts}</span><span className="font-semibold text-red-600">{fmt(totalOwnerCostSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.remainingBalance}</span><span className="font-semibold">{balanceSmall > 0 ? fmt(balanceSmall) + "€" : "0€ ✓"}</span></div>
            <div className="flex justify-between"><span>{t.aptValueIn(horizon)}</span><span className="font-semibold text-green-600">{fmt(aptValueSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolioV1)}€</span></div>
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-blue-700">{fmt(nw1)}€</span></div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-purple-500 ${highlight(nw2)}`}>
          <h3 className="font-bold text-purple-700 mb-2">{t.v2Title(fmt(smallAptPrice))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v2Desc(fmt(downPayment), fmt(txCostSmall), fmt(mortgageSmall), moveOutYears, fmt(rentalIncome))}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.monthlyPayment}</span><span className="font-semibold">{fmt(mSmall.payment)}€</span></div>
            <div className="flex justify-between"><span>{t.ownerCostsMonthly}</span><span className="font-semibold text-red-500">{fmt(ownerCostMonthlySmall)}€</span></div>
            <div className="flex justify-between"><span>{t.rentalIncomeLabel}</span><span className="font-semibold text-green-600">{fmt(rentalIncome)}€{t.perMonth} {t.afterYears(moveOutYears)}</span></div>
            <div className="flex justify-between"><span>{t.rentPaidLabel}</span><span className="font-semibold text-red-500">{fmt(newRent)}€{t.perMonth} {t.afterYears(moveOutYears)}</span></div>
            <div className="flex justify-between"><span>{t.interestPaid}</span><span className="font-semibold text-red-600">{fmt(interestPaidSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.totalOwnerCosts}</span><span className="font-semibold text-red-600">{fmt(totalOwnerCostSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.totalRent(Math.max(0, horizon - moveOutYears))}</span><span className="font-semibold text-red-600">{fmt(totalRentV2)}€</span></div>
            <div className="flex justify-between"><span>{t.remainingBalance}</span><span className="font-semibold">{balanceSmall > 0 ? fmt(balanceSmall) + "€" : "0€ ✓"}</span></div>
            <div className="flex justify-between"><span>{t.aptValueIn(horizon)}</span><span className="font-semibold text-green-600">{fmt(aptValueSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolioV2)}€</span></div>
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-purple-700">{fmt(nw2)}€</span></div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-green-500 ${highlight(nw3)}`}>
          <h3 className="font-bold text-green-700 mb-2">{t.v3Title(fmt(largeAptPrice))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v3Desc(fmt(downPayment), fmt(txCostLarge), fmt(mortgageLarge))}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.monthlyPayment}</span><span className="font-semibold">{fmt(mLarge.payment)}€</span></div>
            <div className="flex justify-between"><span>{t.ownerCostsMonthly}</span><span className="font-semibold text-red-500">{fmt(ownerCostMonthlyLarge)}€</span></div>
            <div className="flex justify-between"><span>{t.monthlyInvestment}</span><span className="font-semibold text-green-600">{fmt(extraMonthlyV3)}€{yearsAfterMortgageV3 > 0 ? ` → ${fmt(monthlyBudget - ownerCostMonthlyLarge)}€ ${t.afterYears(largeAptYears)}` : ""}</span></div>
            <div className="flex justify-between"><span>{t.interestPaid}</span><span className="font-semibold text-red-600">{fmt(interestPaidLarge)}€</span></div>
            <div className="flex justify-between"><span>{t.totalOwnerCosts}</span><span className="font-semibold text-red-600">{fmt(totalOwnerCostLarge)}€</span></div>
            <div className="flex justify-between"><span>{t.remainingBalance}</span><span className="font-semibold">{balanceLarge > 0 ? fmt(balanceLarge) + "€" : "0€ ✓"}</span></div>
            <div className="flex justify-between"><span>{t.aptValueIn(horizon)}</span><span className="font-semibold text-green-600">{fmt(aptValueLarge)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolioV3)}€</span></div>
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-green-700">{fmt(nw3)}€</span></div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-orange-500 ${highlight(nw4)}`}>
          <h3 className="font-bold text-orange-700 mb-2">{t.v4Title}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v4Desc(fmt(downPayment), fmt(extraMonthlyV4))}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.initialRent}</span><span className="font-semibold">{fmt(newRent)}€{t.perMonth}</span></div>
            <div className="flex justify-between"><span>{t.rentInYear(horizon)}</span><span className="font-semibold text-red-500">{fmt(newRent * Math.pow(1 + rentInflation / 100, Math.max(0, horizon - 1)))}€{t.perMonth}</span></div>
            <div className="flex justify-between"><span>{t.totalRent(horizon)}</span><span className="font-semibold text-red-600">{fmt(totalRentV4)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolioV4)}€</span></div>
            <div className="flex justify-between"><span>{t.property}</span><span className="font-semibold text-gray-400">0€</span></div>
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-orange-700">{fmt(nw4)}€</span></div>
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
