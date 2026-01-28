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
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString("fr-FR")} FCFA`;
}

function formatSupplier(amount, symbol) {
  return `${symbol}${amount.toFixed(2)}`;
}

function setDash() {
  const ids = [
    "rSupplierTotal", "rSupplierTotalXof", "rBankFeeXof", "rPaidSupplierXof",
    "rTotal", "rUnit", "rSale", "rProfit"
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "—";
  });
}

function updateBankFeeUI() {
  const modeEl = document.getElementById("bankFeeMode");
  const pct = document.getElementById("cardFeePct");
  const fixed = document.getElementById("cardFeeFixedXof");
  if (!modeEl || !pct || !fixed) return;

  const isPct = modeEl.value === "pct";
  pct.disabled = !isPct;
  fixed.disabled = isPct;

  // Optionnel : ne pas vider (ça évite de perdre une valeur saisie)
  // Si tu veux vider, décommente :
  // if (isPct) fixed.value = "";
  // else pct.value = "";
}

function calculate() {
  const currency = document.getElementById("currency").value;
  const symbol = currencySymbol(currency);

  const unitPrice = num(document.getElementById("unitPrice").value);
  const qty = int(document.getElementById("qty").value);

  const exchangeRate = num(document.getElementById("exchangeRate").value);
  const chinaShipping = num(document.getElementById("chinaShipping").value);

  const bankFeeMode = document.getElementById("bankFeeMode").value;
  const cardFeePct = num(document.getElementById("cardFeePct").value);
  const cardFeeFixedXof = num(document.getElementById("cardFeeFixedXof").value);

  const weightKg = num(document.getElementById("weightKg").value);
  const ratePerKg = num(document.getElementById("ratePerKg").value);

  const customsXof = num(document.getElementById("customs").value);
  const otherFeesXof = num(document.getElementById("otherFees").value);

  const marginPct = num(document.getElementById("margin").value);

  if (qty <= 0 || exchangeRate <= 0) {
    setDash();
    return;
  }

  // 1) Total fournisseur (devise)
  const supplierTotal = (unitPrice * qty) + chinaShipping;

  // 2) Conversion XOF
  const supplierTotalXof = supplierTotal * exchangeRate;

  // 3) Frais banque (XOF)
  const bankFeeXof =
    bankFeeMode === "fixed"
      ? cardFeeFixedXof
      : (supplierTotalXof * (cardFeePct / 100));

  // 4) Payé au fournisseur (XOF)
  const paidSupplierXof = supplierTotalXof + bankFeeXof;

  // 5) Transitaire (XOF)
  const freightXof = weightKg * ratePerKg;

  // 6) Total rendu (XOF)
  const totalXof = paidSupplierXof + freightXof + customsXof + otherFeesXof;

  const costPerUnitXof = totalXof / qty;
  const salePriceUnitXof = costPerUnitXof * (1 + marginPct / 100);
  const profitTotalXof = (salePriceUnitXof * qty) - totalXof;

  // Affichage
  document.getElementById("rSupplierTotal").textContent = formatSupplier(supplierTotal, symbol);
  document.getElementById("rSupplierTotalXof").textContent = formatXOF(supplierTotalXof);
  document.getElementById("rBankFeeXof").textContent = formatXOF(bankFeeXof);
  document.getElementById("rPaidSupplierXof").textContent = formatXOF(paidSupplierXof);

  document.getElementById("rTotal").textContent = formatXOF(totalXof);
  document.getElementById("rUnit").textContent = formatXOF(costPerUnitXof);
  document.getElementById("rSale").textContent = formatXOF(salePriceUnitXof);
  document.getElementById("rProfit").textContent = formatXOF(profitTotalXof);
}

function bind() {
  const ids = [
    "currency", "unitPrice", "qty",
    "exchangeRate", "chinaShipping",
    "bankFeeMode", "cardFeePct", "cardFeeFixedXof",
    "weightKg", "ratePerKg",
    "customs", "otherFees",
    "margin"
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", calculate);
    el.addEventListener("change", calculate);
  });

  // Listener spécifique pour mettre à jour l’UI quand on change le mode
  const modeEl = document.getElementById("bankFeeMode");
  if (modeEl) {
    modeEl.addEventListener("change", () => {
      updateBankFeeUI();
      calculate();
    });
  }

  updateBankFeeUI();
  calculate();
}

document.addEventListener("DOMContentLoaded", bind);