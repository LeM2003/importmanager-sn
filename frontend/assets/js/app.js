function num(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function int(value) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

function currencySymbol(code) {
  if (code === "cny") return "¥";
  if (code === "usd") return "$";
  if (code === "eur") return "€";
  return "";
}

function formatXOF(amount) {
  // Affichage lisible: 1 234 567 FCFA
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString("fr-FR")} FCFA`;
}

function calculate() {
  const currency = document.getElementById("currency").value;
  const symbol = currencySymbol(currency);

  const unitPrice = num(document.getElementById("unitPrice").value); // CNY/USD
  const qty = int(document.getElementById("qty").value);

  const exchangeRate = num(document.getElementById("exchangeRate").value); // XOF par 1 devise
  const weightKg = num(document.getElementById("weightKg").value);         // kg total
  const ratePerKg = num(document.getElementById("ratePerKg").value);       // XOF/kg

  const customsXof = num(document.getElementById("customs").value);        // XOF
  const otherFeesXof = num(document.getElementById("otherFees").value);    // XOF

  const marginPct = num(document.getElementById("margin").value);

  // Sécurité
  if (qty <= 0 || exchangeRate <= 0) {
    document.getElementById("rTotal").textContent = "—";
    document.getElementById("rUnit").textContent = "—";
    document.getElementById("rSale").textContent = "—";
    document.getElementById("rProfit").textContent = "—";
    return;
  }

  // 1) Coût produit en devise fournisseur
  const productTotalSupplier = unitPrice * qty;

  // 2) Conversion en XOF
  const productTotalXof = productTotalSupplier * exchangeRate;

  // 3) Coût transitaire (XOF) basé sur poids total
  const freightXof = weightKg * ratePerKg;

  // 4) Total rendu (XOF)
  const totalXof = productTotalXof + freightXof + customsXof + otherFeesXof;

  const costPerUnitXof = totalXof / qty;
  const salePriceUnitXof = costPerUnitXof * (1 + marginPct / 100);
  const profitTotalXof = (salePriceUnitXof * qty) - totalXof;

  // Affichage (XOF)
  document.getElementById("rTotal").textContent = formatXOF(totalXof);
  document.getElementById("rUnit").textContent = formatXOF(costPerUnitXof);
  document.getElementById("rSale").textContent = formatXOF(salePriceUnitXof);
  document.getElementById("rProfit").textContent = formatXOF(profitTotalXof);

  // Optionnel: tu peux aussi afficher info devise si tu veux (plus tard)
  // ex: productTotalSupplier + symbol dans une petite ligne.
}

function bind() {
  const ids = [
    "currency", "unitPrice", "qty",
    "exchangeRate", "weightKg", "ratePerKg",
    "customs", "otherFees",
    "margin"
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", calculate);
    el.addEventListener("change", calculate);
  });

  const btn = document.getElementById("btnCalc");
  if (btn) btn.addEventListener("click", calculate);

  calculate();
}

document.addEventListener("DOMContentLoaded", bind);