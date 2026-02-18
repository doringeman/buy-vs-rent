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
    capitalGainsTax: "Impozit câștig capital (%)",
    smallAptPrice: "Preț apt. mic (€)",
    smallAptYears: "Ani credit apt. mic",
    largeAptPrice: "Preț apt. mare (€)",
    largeAptYears: "Ani credit apt. mare",
    newRent: "Chirie lunară (€/lună, azi)",
    moveOutYears: "Ani până dau în chirie apt. mic",
    rentalIncome: "Chirie primită apt. mic (€/lună)",
    v1Title: (p) => `V1: Apt. mic (${p}€)`,
    v2Title: (p) => `V2: Cumpăr apt. mic (${p}€), dau în chirie`,
    v3Title: (p) => `V3: Apt. mare (${p}€)`,
    v4Title: (r) => `V4: Chirie (${r}€) + Investiții`,
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
    portfolioTax: "Impozit câștig capital:",
    initialRent: "Chirie inițială:",
    rentInYear: (y) => `Chirie în anul ${y}:`,
    totalRent: (y) => `Total chirie ${y} ani:`,
    rentalIncomeLabel: "Venit din chirie:",
    rentPaidLabel: "Chirie plătită:",
    budgetWarning: (x) => `⚠️ Costurile lunare depășesc bugetul cu ${x}€/lună`,
    property: "Proprietate:",
    afterYears: (y) => `(după ${y} ani)`,
    perMonth: "/lună",
    note1: (v) => `✅ Inflația chiriei (${v}%/an) – chiria crește anual, scade suma investită lunar în V4`,
    note2: (v) => `✅ Costuri tranzacție (${v}%) – cresc creditul necesar`,
    note3: (v) => `✅ Costuri proprietar (${v}%/an) – reparații, impozit, fond rulment – scad investiția lunară`,
    note4: "✅ Investiții lunare din diferența buget - rată/chirie - costuri",
    note5: "⚠️ Nu include: inflația ratei (dacă dobândă variabilă), inflația costurilor proprietar, costuri de vânzare apartament",
    summary: "COMPARAȚIE AVERE NETĂ",
    copyLink: "Copiază link",
    linkCopied: "Link copiat!",
    showFormulas: "▶ Arată formulele",
    hideFormulas: "▼ Ascunde formulele",
    fCredit: "Credit = Preț + Tranzacție - Avans",
    fMonthlyPayment: "Rată = Credit × r(1+r)^n / ((1+r)^n - 1)  (anuitate constantă; r = dobândă lunară, n = nr. luni)",
    fOwnerCosts: "Costuri proprietar/lună = Preț × costuri% / 12",
    fMonthlyInvest: "Investiție lunară = Buget - Rată - Costuri proprietar",
    fInterestPaid: "Dobândă plătită = Rată lunară × luni_plătite - (Credit - Sold)  (total plătit minus principal rambursat)",
    fRemainingBalance: "Sold = Credit × ((1+r)^n - (1+r)^k) / ((1+r)^n - 1)  (capital rămas după k luni plătite)",
    fAptValue: "Valoare apt = Preț × (1 + apreciere%)^ani  (creștere compusă)",
    fPortfolioBuy: "P(m) = P(m-1) × (1 + rand/12) + investiție  (simulare lună cu lună, randament compus + contribuție)",
    fPortfolioTax: "Impozit = (Portofoliu - Contribuții) × impozit%  (se aplică doar pe câștig)",
    fNetWorthBuy: "Avere netă = Valoare apt - Sold + Portofoliu - Impozit",
    fV2NetMonthly: "După mutare: net lunar = Buget - Rată - Costuri + Chirie primită×(1+inflație)^an - Chirie plătită×(1+inflație)^an  (chiriile cresc cu inflația)",
    fTotalRent: "Total chirie = Σ(chirie × (1+inflație%)^an × 12)  (sumă pe toți anii, chirie ajustată cu inflația)",
    fRentInYear: "Chirie în anul Y = Chirie × (1 + inflație%)^(Y-1)  (creștere compusă)",
    fPortfolioRent: "P(m) = P(m-1) × (1 + rand/12) + max(0, Buget - Chirie curentă)  (pornește cu Avans, randament compus + surplus lunar)",
    fNetWorthRent: "Avere netă = Portofoliu - Impozit",
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
    capitalGainsTax: "Capital gains tax (%)",
    smallAptPrice: "Small apt. price (€)",
    smallAptYears: "Mortgage years (small apt.)",
    largeAptPrice: "Large apt. price (€)",
    largeAptYears: "Mortgage years (large apt.)",
    newRent: "Monthly rent (€/month, today)",
    moveOutYears: "Years before renting out small apt",
    rentalIncome: "Rental income small apt (€/mo)",
    v1Title: (p) => `V1: Small apt. (${p}€)`,
    v2Title: (p) => `V2: Buy small (${p}€), rent out`,
    v3Title: (p) => `V3: Large apt. (${p}€)`,
    v4Title: (r) => `V4: Rent (${r}€) + Invest`,
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
    portfolioTax: "Capital gains tax:",
    initialRent: "Initial rent:",
    rentInYear: (y) => `Rent in year ${y}:`,
    totalRent: (y) => `Total rent ${y} yrs:`,
    rentalIncomeLabel: "Rental income:",
    rentPaidLabel: "Rent paid:",
    budgetWarning: (x) => `⚠️ Monthly costs exceed budget by ${x}€/mo`,
    property: "Property:",
    afterYears: (y) => `(after ${y} yrs)`,
    perMonth: "/mo",
    note1: (v) => `✅ Rent inflation (${v}%/yr) – rent increases annually, reduces monthly investment in V4`,
    note2: (v) => `✅ Transaction costs (${v}%) – increase mortgage`,
    note3: (v) => `✅ Owner costs (${v}%/yr) – repairs, tax, maintenance – reduce monthly investment`,
    note4: "✅ Monthly investments from budget minus payment/rent minus costs",
    note5: "⚠️ Not included: variable rate changes, owner cost inflation, selling transaction costs",
    summary: "NET WORTH COMPARISON",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    showFormulas: "▶ Show formulas",
    hideFormulas: "▼ Hide formulas",
    fCredit: "Mortgage = Price + Transaction - Down payment",
    fMonthlyPayment: "Payment = Mortgage × r(1+r)^n / ((1+r)^n - 1)  (fixed annuity; r = monthly rate, n = total months)",
    fOwnerCosts: "Owner costs/mo = Price × costs% / 12",
    fMonthlyInvest: "Monthly investment = Budget - Payment - Owner costs",
    fInterestPaid: "Interest paid = Payment × months_paid - (Mortgage - Balance)  (total paid minus principal repaid)",
    fRemainingBalance: "Balance = Mortgage × ((1+r)^n - (1+r)^k) / ((1+r)^n - 1)  (remaining principal after k months paid)",
    fAptValue: "Apt value = Price × (1 + appreciation%)^years  (compound growth)",
    fPortfolioBuy: "P(m) = P(m-1) × (1 + return/12) + investment  (month-by-month simulation, compound return + contribution)",
    fPortfolioTax: "Tax = (Portfolio - Contributions) × tax%  (applied only on gains)",
    fNetWorthBuy: "Net worth = Apt value - Balance + Portfolio - Tax",
    fV2NetMonthly: "After move: net monthly = Budget - Payment - Costs + Rental income×(1+inflation)^yr - Rent paid×(1+inflation)^yr  (rents grow with inflation)",
    fTotalRent: "Total rent = Σ(rent × (1+inflation%)^yr × 12)  (sum over all years, rent adjusted for inflation)",
    fRentInYear: "Rent in year Y = Rent × (1 + inflation%)^(Y-1)  (compound growth)",
    fPortfolioRent: "P(m) = P(m-1) × (1 + return/12) + max(0, Budget - Current rent)  (starts with Down payment, compound return + monthly surplus)",
    fNetWorthRent: "Net worth = Portfolio - Tax",
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
  let contributions = downPayment;
  for (let m = 0; m < years * 12; m++) {
    const currentRent = monthlyRent * Math.pow(1 + rentInflation / 100, Math.floor(m / 12));
    const contrib = Math.max(0, monthlyBudget - currentRent);
    portfolio = portfolio * (1 + r) + contrib;
    contributions += contrib;
  }
  return { portfolio, contributions };
}

function buyRentOutSimulation(monthlyBudget, payment, mortgageYears, ownerCostMonthly, rentalIncome, moveOutYears, monthlyRent, rentInflation, investReturn, horizon) {
  const r = investReturn / 100 / 12;
  let portfolio = 0;
  let contributions = 0;
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
    const contrib = Math.max(0, monthlyNet);
    portfolio = portfolio * (1 + r) + contrib;
    contributions += contrib;
  }
  return { portfolio, contributions };
}

function mortgageInvestSimulation(monthlyBudget, payment, mortgageYears, ownerCostMonthly, investReturn, horizon) {
  const r = investReturn / 100 / 12;
  let portfolio = 0;
  let contributions = 0;
  for (let m = 0; m < horizon * 12; m++) {
    const currentPayment = Math.floor(m / 12) < mortgageYears ? payment : 0;
    const contrib = Math.max(0, monthlyBudget - currentPayment - ownerCostMonthly);
    portfolio = portfolio * (1 + r) + contrib;
    contributions += contrib;
  }
  return { portfolio, contributions };
}

const hashKeys = {
  dp: "downPayment", ir: "interestRate", iv: "investReturn", nr: "newRent",
  sp: "smallAptPrice", lp: "largeAptPrice", sy: "smallAptYears", ly: "largeAptYears",
  h: "horizon", ap: "appreciation", mb: "monthlyBudget",
  ri: "rentInflation", tc: "transactionCostPct", oc: "ownerCostPct",
  mo: "moveOutYears", rn: "rentalIncome", cg: "capitalGainsTax",
};
const hashKeysReverse = Object.fromEntries(Object.entries(hashKeys).map(([k, v]) => [v, k]));

function parseHash() {
  try {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const result = {};
    for (const [short, full] of Object.entries(hashKeys)) {
      if (params.has(short)) result[full] = params.get(short);
    }
    return Object.keys(result).length > 0 ? result : null;
  } catch { return null; }
}

function buildShareUrl(inputs) {
  const params = new URLSearchParams();
  for (const [full, short] of Object.entries(hashKeysReverse)) {
    if (inputs[full]) params.set(short, inputs[full]);
  }
  return window.location.origin + window.location.pathname + "#" + params.toString();
}

export default function App() {
  const defaultInputs = {
    downPayment: "30000", interestRate: "5.5", investReturn: "7", newRent: "500",
    smallAptPrice: "75000", largeAptPrice: "120000", smallAptYears: "25", largeAptYears: "30",
    horizon: "15", appreciation: "3", monthlyBudget: "800",
    rentInflation: "3", transactionCostPct: "2", ownerCostPct: "1",
    moveOutYears: "3", rentalIncome: "400", capitalGainsTax: "10",
  };

  const [lang, setLang] = useState(() => localStorage.getItem("bvr-lang") || "ro");
  const t = translations[lang];

  const [inputs, setInputs] = useState(() => {
    const fromHash = parseHash();
    if (fromHash) return { ...defaultInputs, ...fromHash };
    try {
      const saved = JSON.parse(localStorage.getItem("bvr-inputs"));
      return saved ? { ...defaultInputs, ...saved } : defaultInputs;
    } catch { return defaultInputs; }
  });

  useEffect(() => { localStorage.setItem("bvr-inputs", JSON.stringify(inputs)); }, [inputs]);
  useEffect(() => { localStorage.setItem("bvr-lang", lang); }, [lang]);

  const [copied, setCopied] = useState(false);
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(buildShareUrl(inputs)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [inputs]);

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
  const capitalGainsTax = v("capitalGainsTax");

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
  const simV1 = mortgageInvestSimulation(monthlyBudget, mSmall.payment, smallAptYears, ownerCostMonthlySmall, investReturn, horizon);
  const taxV1 = Math.max(0, (simV1.portfolio - simV1.contributions) * capitalGainsTax / 100);
  const portfolioV1 = simV1.portfolio;
  const extraMonthlyV1 = Math.max(0, monthlyBudget - mSmall.payment - ownerCostMonthlySmall);
  const extraAfterV1 = monthlyBudget - ownerCostMonthlySmall;
  const yearsAfterMortgageV1 = Math.max(0, horizon - smallAptYears);

  // V2: buy small, rent it out after moveOutYears, move to rented place
  const simV2 = buyRentOutSimulation(monthlyBudget, mSmall.payment, smallAptYears, ownerCostMonthlySmall, rentalIncome, moveOutYears, newRent, rentInflation, investReturn, horizon);
  const taxV2 = Math.max(0, (simV2.portfolio - simV2.contributions) * capitalGainsTax / 100);
  const portfolioV2 = simV2.portfolio;
  const totalRentV2 = totalRentWithInflation(newRent, rentInflation, Math.max(0, horizon - moveOutYears));

  // V3: buy large, live in it
  const simV3 = mortgageInvestSimulation(monthlyBudget, mLarge.payment, largeAptYears, ownerCostMonthlyLarge, investReturn, horizon);
  const taxV3 = Math.max(0, (simV3.portfolio - simV3.contributions) * capitalGainsTax / 100);
  const portfolioV3 = simV3.portfolio;
  const extraMonthlyV3 = Math.max(0, monthlyBudget - mLarge.payment - ownerCostMonthlyLarge);
  const yearsAfterMortgageV3 = Math.max(0, horizon - largeAptYears);

  // V4: rent + invest
  const totalRentV4 = totalRentWithInflation(newRent, rentInflation, horizon);
  const simV4 = rentInvestSimulation(downPayment, monthlyBudget, newRent, rentInflation, investReturn, horizon);
  const taxV4 = Math.max(0, (simV4.portfolio - simV4.contributions) * capitalGainsTax / 100);
  const portfolioV4 = simV4.portfolio;
  const extraMonthlyV4 = Math.max(0, monthlyBudget - newRent);

  const shortfallV1 = mSmall.payment + ownerCostMonthlySmall - monthlyBudget;
  const shortfallV2 = mSmall.payment + ownerCostMonthlySmall - monthlyBudget;
  const shortfallV3 = mLarge.payment + ownerCostMonthlyLarge - monthlyBudget;
  const shortfallV4 = newRent - monthlyBudget;

  const nw1 = aptValueSmall - balanceSmall + portfolioV1 - taxV1;
  const nw2 = aptValueSmall - balanceSmall + portfolioV2 - taxV2;
  const nw3 = aptValueLarge - balanceLarge + portfolioV3 - taxV3;
  const nw4 = portfolioV4 - taxV4;

  const best = Math.max(nw1, nw2, nw3, nw4);
  const highlight = (nw) => nw === best ? "ring-2 ring-yellow-400" : "";
  const Warning = ({ shortfall }) => shortfall > 0 ? (
    <div className="bg-red-50 border border-red-300 text-red-700 text-xs font-semibold rounded p-2 mb-3">{t.budgetWarning(fmt(shortfall))}</div>
  ) : null;

  const FormulaSection = ({ formulas }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className="mt-3">
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
          {expanded ? t.hideFormulas : t.showFormulas}
        </button>
        {expanded && (
          <div className="bg-gray-50 rounded p-3 mt-2 text-xs font-mono space-y-1">
            {formulas.map((f, i) => <div key={i}>{f}</div>)}
          </div>
        )}
      </div>
    );
  };

  const ic = "w-full p-2 border border-gray-300 rounded text-sm";
  const lc = "text-xs text-gray-500 mb-1";

  return (
    <div className="bg-gray-50 min-h-screen p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={copyLink}
            className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >{copied ? t.linkCopied : t.copyLink}</button>
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
          <div><div className={lc}>{t.capitalGainsTax}</div><input type="number" step="1" className={ic} value={inputs.capitalGainsTax} onChange={set("capitalGainsTax")} /></div>
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

      {best > 0 && (() => {
        const bars = [
          { label: t.v1Title(fmt(smallAptPrice)), color: "bg-blue-500", nw: nw1 },
          { label: t.v2Title(fmt(smallAptPrice)), color: "bg-purple-500", nw: nw2 },
          { label: t.v3Title(fmt(largeAptPrice)), color: "bg-green-500", nw: nw3 },
          { label: t.v4Title(fmt(newRent)), color: "bg-orange-500", nw: nw4 },
        ].sort((a, b) => b.nw - a.nw);
        return (
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-semibold text-sm text-gray-600 mb-3">{t.summary}</h2>
            <div className="space-y-2">
              {bars.map((b, i) => {
                const below = bars[i + 1];
                const pct = below && below.nw > 0 ? Math.round((b.nw - below.nw) / below.nw * 100) : 0;
                return (
                  <div key={b.label} className="flex items-center gap-3">
                    <span className={`text-xs font-semibold shrink-0 w-80 ${i === 0 ? "text-gray-900" : "text-gray-500"}`}>{b.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                      <div
                        className={`${b.color} h-6 rounded-full transition-all duration-500 ${i === 0 ? "opacity-100" : "opacity-60"}`}
                        style={{ width: `${Math.max(0, (b.nw / best) * 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold w-24 text-right ${i === 0 ? "text-gray-900" : "text-gray-500"}`}>{fmt(b.nw)}€</span>
                    <span className="text-xs text-green-600 font-semibold w-14">{pct > 0 ? `+${pct}%` : ""}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-blue-500 ${highlight(nw1)}`}>
          <h3 className="font-bold text-blue-700 mb-2">{t.v1Title(fmt(smallAptPrice))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v1Desc(fmt(downPayment), fmt(txCostSmall), fmt(mortgageSmall))}</div>
          <Warning shortfall={shortfallV1} />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.monthlyPayment}</span><span className="font-semibold">{fmt(mSmall.payment)}€</span></div>
            <div className="flex justify-between"><span>{t.ownerCostsMonthly}</span><span className="font-semibold text-red-500">{fmt(ownerCostMonthlySmall)}€</span></div>
            <div className="flex justify-between"><span>{t.monthlyInvestment}</span><span className="font-semibold text-green-600">{fmt(extraMonthlyV1)}€{yearsAfterMortgageV1 > 0 ? ` → ${fmt(extraAfterV1)}€ ${t.afterYears(smallAptYears)}` : ""}</span></div>
            <div className="flex justify-between"><span>{t.interestPaid}</span><span className="font-semibold text-red-600">{fmt(interestPaidSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.totalOwnerCosts}</span><span className="font-semibold text-red-600">{fmt(totalOwnerCostSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.remainingBalance}</span><span className="font-semibold">{balanceSmall > 0 ? fmt(balanceSmall) + "€" : "0€ ✓"}</span></div>
            <div className="flex justify-between"><span>{t.aptValueIn(horizon)}</span><span className="font-semibold text-green-600">{fmt(aptValueSmall)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolioV1)}€</span></div>
            {taxV1 > 0 && <div className="flex justify-between"><span>{t.portfolioTax}</span><span className="font-semibold text-red-600">-{fmt(taxV1)}€</span></div>}
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-blue-700">{fmt(nw1)}€</span></div>
          </div>
          <FormulaSection formulas={[
            t.fCredit, t.fMonthlyPayment, t.fOwnerCosts, t.fMonthlyInvest,
            t.fInterestPaid, t.fRemainingBalance, t.fAptValue, t.fPortfolioBuy, t.fPortfolioTax, t.fNetWorthBuy,
          ]} />
        </div>

        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-purple-500 ${highlight(nw2)}`}>
          <h3 className="font-bold text-purple-700 mb-2">{t.v2Title(fmt(smallAptPrice))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v2Desc(fmt(downPayment), fmt(txCostSmall), fmt(mortgageSmall), moveOutYears, fmt(rentalIncome))}</div>
          <Warning shortfall={shortfallV2} />
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
            {taxV2 > 0 && <div className="flex justify-between"><span>{t.portfolioTax}</span><span className="font-semibold text-red-600">-{fmt(taxV2)}€</span></div>}
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-purple-700">{fmt(nw2)}€</span></div>
          </div>
          <FormulaSection formulas={[
            t.fCredit, t.fMonthlyPayment, t.fOwnerCosts, t.fInterestPaid,
            t.fRemainingBalance, t.fAptValue, t.fV2NetMonthly, t.fTotalRent,
            t.fPortfolioBuy, t.fPortfolioTax, t.fNetWorthBuy,
          ]} />
        </div>

        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-green-500 ${highlight(nw3)}`}>
          <h3 className="font-bold text-green-700 mb-2">{t.v3Title(fmt(largeAptPrice))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v3Desc(fmt(downPayment), fmt(txCostLarge), fmt(mortgageLarge))}</div>
          <Warning shortfall={shortfallV3} />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.monthlyPayment}</span><span className="font-semibold">{fmt(mLarge.payment)}€</span></div>
            <div className="flex justify-between"><span>{t.ownerCostsMonthly}</span><span className="font-semibold text-red-500">{fmt(ownerCostMonthlyLarge)}€</span></div>
            <div className="flex justify-between"><span>{t.monthlyInvestment}</span><span className="font-semibold text-green-600">{fmt(extraMonthlyV3)}€{yearsAfterMortgageV3 > 0 ? ` → ${fmt(monthlyBudget - ownerCostMonthlyLarge)}€ ${t.afterYears(largeAptYears)}` : ""}</span></div>
            <div className="flex justify-between"><span>{t.interestPaid}</span><span className="font-semibold text-red-600">{fmt(interestPaidLarge)}€</span></div>
            <div className="flex justify-between"><span>{t.totalOwnerCosts}</span><span className="font-semibold text-red-600">{fmt(totalOwnerCostLarge)}€</span></div>
            <div className="flex justify-between"><span>{t.remainingBalance}</span><span className="font-semibold">{balanceLarge > 0 ? fmt(balanceLarge) + "€" : "0€ ✓"}</span></div>
            <div className="flex justify-between"><span>{t.aptValueIn(horizon)}</span><span className="font-semibold text-green-600">{fmt(aptValueLarge)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolioV3)}€</span></div>
            {taxV3 > 0 && <div className="flex justify-between"><span>{t.portfolioTax}</span><span className="font-semibold text-red-600">-{fmt(taxV3)}€</span></div>}
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-green-700">{fmt(nw3)}€</span></div>
          </div>
          <FormulaSection formulas={[
            t.fCredit, t.fMonthlyPayment, t.fOwnerCosts, t.fMonthlyInvest,
            t.fInterestPaid, t.fRemainingBalance, t.fAptValue, t.fPortfolioBuy, t.fPortfolioTax, t.fNetWorthBuy,
          ]} />
        </div>

        <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-orange-500 ${highlight(nw4)}`}>
          <h3 className="font-bold text-orange-700 mb-2">{t.v4Title(fmt(newRent))}</h3>
          <div className="text-xs text-gray-500 mb-3">{t.v4Desc(fmt(downPayment), fmt(extraMonthlyV4))}</div>
          <Warning shortfall={shortfallV4} />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t.initialRent}</span><span className="font-semibold">{fmt(newRent)}€{t.perMonth}</span></div>
            <div className="flex justify-between"><span>{t.rentInYear(horizon)}</span><span className="font-semibold text-red-500">{fmt(newRent * Math.pow(1 + rentInflation / 100, Math.max(0, horizon - 1)))}€{t.perMonth}</span></div>
            <div className="flex justify-between"><span>{t.totalRent(horizon)}</span><span className="font-semibold text-red-600">{fmt(totalRentV4)}€</span></div>
            <div className="flex justify-between"><span>{t.investmentPortfolio}</span><span className="font-semibold text-green-600">{fmt(portfolioV4)}€</span></div>
            {taxV4 > 0 && <div className="flex justify-between"><span>{t.portfolioTax}</span><span className="font-semibold text-red-600">-{fmt(taxV4)}€</span></div>}
            <div className="flex justify-between"><span>{t.property}</span><span className="font-semibold text-gray-400">0€</span></div>
            <hr />
            <div className="flex justify-between font-bold text-base"><span>{t.netWorth}</span><span className="text-orange-700">{fmt(nw4)}€</span></div>
          </div>
          <FormulaSection formulas={[
            t.fRentInYear, t.fTotalRent, t.fPortfolioRent, t.fPortfolioTax, t.fNetWorthRent,
          ]} />
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
