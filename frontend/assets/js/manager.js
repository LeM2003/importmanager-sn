const KEY_PRODUCTS = "ims_products";
const KEY_LOTS = "ims_lots";
const KEY_SALES = "ims_sales";

function load(key){
  try { return JSON.parse(localStorage.getItem(key)) ?? []; }
  catch { return []; }
}
function save(key, data){
  localStorage.setItem(key, JSON.stringify(data));
}

function fmtXOF(n){
  return `${Math.round(n).toLocaleString("fr-FR")} FCFA`;
}
function fmtDate(iso){
  return new Date(iso).toLocaleString("fr-FR");
}
function normName(s){
  return (s || "").trim().toLowerCase();
}

function renderProducts(){
  const products = load(KEY_PRODUCTS);
  const body = document.getElementById("productsBody");
  const empty = document.getElementById("productsEmpty");
  body.innerHTML = "";
  empty.style.display = products.length ? "none" : "block";

  products.forEach(p => {
    const stock = p.stockQty || 0;
    const sell = p.sellPriceUnitXof || 0;
    const costTotal = p.totalCostXof || 0;

    const revenue = sell * stock;
    const profit = revenue - costTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.name}</strong></td>
      <td>${stock}</td>
      <td>${sell ? fmtXOF(sell) : "—"}</td>
      <td>${fmtXOF(costTotal)}</td>
      <td>${sell ? fmtXOF(revenue) : "—"}</td>
      <td>${sell ? fmtXOF(profit) : "—"}</td>
      <td>
        <button class="btn btn-secondary" data-edit="${p.id}">Modifier</button>
        <button class="btn btn-secondary" data-sell="${p.id}">Vendre</button>
        <button class="btn btn-secondary" data-del="${p.id}">Suppr</button>
      </td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll("button[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del");
      const next = load(KEY_PRODUCTS).filter(x => x.id !== id);
      save(KEY_PRODUCTS, next);
      renderProducts();
    });
  });

  body.querySelectorAll("button[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit");
      const p = load(KEY_PRODUCTS).find(x => x.id === id);
      if (!p) return;
      document.getElementById("pName").value = p.name;
      document.getElementById("pSell").value = p.sellPriceUnitXof || "";
      document.getElementById("pName").focus();
    });
  });

  body.querySelectorAll("button[data-sell]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-sell");
      const products = load(KEY_PRODUCTS);
      const p = products.find(x => x.id === id);
      if (!p) return;

      if ((p.stockQty || 0) <= 0) {
        alert("Stock insuffisant.");
        return;
      }

      const qtyStr = prompt(`Quantité vendue ? (stock: ${p.stockQty})`, "1");
      if (qtyStr === null) return;
      const qtySold = parseInt(qtyStr, 10);
      if (!Number.isFinite(qtySold) || qtySold <= 0) return alert("Quantité invalide.");
      if (qtySold > p.stockQty) return alert("Quantité vendue > stock.");

      const defaultPrice = p.sellPriceUnitXof || "";
      const priceStr = prompt("Prix de vente unitaire (FCFA) ?", String(defaultPrice));
      if (priceStr === null) return;
      const priceUnit = parseFloat(priceStr);
      if (!Number.isFinite(priceUnit) || priceUnit <= 0) return alert("Prix invalide.");

      // Coût moyen et coût sorti du stock
      const avgCostUnit = p.stockQty > 0 ? (p.totalCostXof / p.stockQty) : 0;
      const costSold = Math.round(avgCostUnit * qtySold);

      // CA & bénéfice
      const revenue = priceUnit * qtySold;
      const profit = revenue - costSold;

      // Mise à jour produit (stock global)
      p.stockQty -= qtySold;
      p.totalCostXof = Math.max(0, Math.round(p.totalCostXof - costSold));

      save(KEY_PRODUCTS, products);

      // Sauver vente (historique)
      const sales = load(KEY_SALES);
      sales.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        productId: p.id,
        productName: p.name,
        qtySold,
        priceUnitXof: priceUnit,
        revenueXof: revenue,
        costSoldXof: costSold,
        profitXof: profit
      });
      save(KEY_SALES, sales);

      renderProducts();
      renderSales();
    });
  });
}

function renderLots(){
  const lots = load(KEY_LOTS);
  const body = document.getElementById("lotsBody");
  const empty = document.getElementById("lotsEmpty");
  body.innerHTML = "";
  empty.style.display = lots.length ? "none" : "block";

  lots.forEach(l => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fmtDate(l.createdAt)}</td>
      <td>${l.productName}</td>
      <td>${l.qty}</td>
      <td>${l.supplierTotalText}</td>
      <td>${fmtXOF(l.paidSupplierXof)}</td>
      <td>${fmtXOF(l.freightXof)}</td>
      <td><strong>${fmtXOF(l.totalXof)}</strong></td>
      <td><button class="btn btn-secondary" data-del="${l.id}">Suppr</button></td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll("button[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del");
      const next = load(KEY_LOTS).filter(x => x.id !== id);
      save(KEY_LOTS, next);
      renderLots();
    });
  });
}

function renderSales(){
  const sales = load(KEY_SALES);
  const body = document.getElementById("salesBody");
  const empty = document.getElementById("salesEmpty");
  body.innerHTML = "";
  empty.style.display = sales.length ? "none" : "block";

  sales.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fmtDate(s.createdAt)}</td>
      <td>${s.productName}</td>
      <td>${s.qtySold}</td>
      <td>${fmtXOF(s.priceUnitXof)}</td>
      <td><strong>${fmtXOF(s.revenueXof)}</strong></td>
      <td>${fmtXOF(s.costSoldXof)}</td>
      <td><strong>${fmtXOF(s.profitXof)}</strong></td>
    `;
    body.appendChild(tr);
  });
}

function upsertProduct(){
  const nameRaw = document.getElementById("pName").value;
  const name = nameRaw.trim();
  if (!name) return;

  const sell = parseFloat(document.getElementById("pSell").value);
  const sellXof = Number.isFinite(sell) ? sell : 0;

  const products = load(KEY_PRODUCTS);
  const existing = products.find(p => normName(p.name) === normName(name));

  if (existing) {
    existing.sellPriceUnitXof = sellXof;
  } else {
    products.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      stockQty: 0,
      sellPriceUnitXof: sellXof,
      totalCostXof: 0,
      createdAt: new Date().toISOString()
    });
  }

  save(KEY_PRODUCTS, products);
  renderProducts();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnUpsert").addEventListener("click", upsertProduct);
  document.getElementById("btnReset").addEventListener("click", () => {
    document.getElementById("pName").value = "";
    document.getElementById("pSell").value = "";
  });

  document.getElementById("btnClearProducts").addEventListener("click", () => {
    if (!confirm("Supprimer tous les produits ?")) return;
    localStorage.removeItem(KEY_PRODUCTS);
    renderProducts();
  });

  document.getElementById("btnClearLots").addEventListener("click", () => {
    if (!confirm("Supprimer tous les lots ?")) return;
    localStorage.removeItem(KEY_LOTS);
    renderLots();
  });

  document.getElementById("btnClearSales").addEventListener("click", () => {
    if (!confirm("Supprimer toutes les ventes ?")) return;
    localStorage.removeItem(KEY_SALES);
    renderSales();
  });

  renderProducts();
  renderLots();
  renderSales();
});