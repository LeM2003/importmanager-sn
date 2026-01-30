// ===== Storage keys (communs avec manager.js) =====
const KEY_PRODUCTS = "ims_products";
const KEY_LOTS = "ims_lots";

// Snapshot du dernier calcul (pour enregistrer un lot)
let lastComputed = null;

// ===== Utils =====
function load(key){
  try { return JSON.parse(localStorage.getItem(key)) ?? []; }
  catch { return []; }
}
function save(key, data){
  localStorage.setItem(key, JSON.stringify(data));
}
function uuid(){
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function normName(s){
  return (s || "").trim().toLowerCase();
}

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
}

// ===== Core =====
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
    lastComputed = null;
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

  // Snapshot pour enregistrement lot
  const productName = (document.getElementById("productName")?.value || "").trim();
  lastComputed = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    productName: productName || "—",
    qty,
    supplierTotalText: formatSupplier(supplierTotal, symbol),
    supplierTotalXof,
    bankFeeXof,
    paidSupplierXof,
    freightXof,
    totalXof
  };

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
    "productName",
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

  // Bank UI
  const modeEl = document.getElementById("bankFeeMode");
  if (modeEl) {
    modeEl.addEventListener("change", () => {
      updateBankFeeUI();
      calculate();
    });
  }

  // Enregistrer un lot -> maj stock global produit
  const btnSaveLot = document.getElementById("btnSaveLot");
  if (btnSaveLot) {
    btnSaveLot.addEventListener("click", () => {
      const name = (document.getElementById("productName")?.value || "").trim();
      if (!name) return alert("Renseigne le nom du produit.");
      if (!lastComputed) return alert("Remplis d'abord le formulaire (taux + quantité).");

      // 1) Sauver le lot (historique)
      const lots = load(KEY_LOTS);
      lots.unshift({ ...lastComputed, productName: name });
      save(KEY_LOTS, lots);

      // 2) Mettre à jour le produit (stock global + coût stock total)
      const products = load(KEY_PRODUCTS);
      let p = products.find(x => normName(x.name) === normName(name));
      if (!p) {
        p = {
          id: uuid(),
          name,
          stockQty: 0,
          sellPriceUnitXof: 0,
          totalCostXof: 0,
          createdAt: new Date().toISOString()
        };
        products.unshift(p);
      }

      p.stockQty += lastComputed.qty;
      p.totalCostXof += lastComputed.totalXof;

      save(KEY_PRODUCTS, products);

      window.location.href = "./manager.html";
    });
  }

  updateBankFeeUI();
  calculate();
}

document.addEventListener("DOMContentLoaded", bind);