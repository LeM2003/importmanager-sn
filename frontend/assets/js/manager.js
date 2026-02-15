console.log("manager.js version: client+paid enabled");

const KEY_PRODUCTS = "ims_products";
const KEY_LOTS = "ims_lots";
const KEY_SALES = "ims_sales";

const modalSale = document.getElementById("modalSale");
const formSale = document.getElementById("formSale");
const btnCancelSale = document.getElementById("btnCancelSale");

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

  // Ouverture de la modale Vendre
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

      // Pré-remplir le formulaire
      document.getElementById("saleProductId").value = p.id;
      document.getElementById("saleProductName").value = p.name;
      document.getElementById("saleQty").value = 1;
      document.getElementById("saleQty").max = p.stockQty; // Limite max = stock actuel
      document.getElementById("salePrice").value = p.sellPriceUnitXof || "";
      document.getElementById("saleClient").value = "";
      document.getElementById("saleStatus").value = "paid"; // Par défaut

      // Afficher la modale
      modalSale.classList.remove("hidden");
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
    const status = (s.orderStatus ?? "active");
    const pay = (s.paymentStatus ?? "pending");

    let statusText = "—";
    if (status === "cancelled") statusText = "Annulée";
    else statusText = (pay === "paid" ? "Payé" : "En attente");

    tr.innerHTML = `
      <td>${fmtDate(s.createdAt)}</td>
      <td>${s.productName}</td>
      <td>${s.clientName || "—"}</td>
      <td>${statusText}</td>
      <td>${s.qtySold}</td>
      <td>${fmtXOF(s.priceUnitXof)}</td>
      <td><strong>${fmtXOF(s.revenueXof)}</strong></td>
      <td>${fmtXOF(s.costSoldXof)}</td>
      <td><strong>${fmtXOF(s.profitXof)}</strong></td>
      <td>
        ${(status === "active" && pay === "pending")
          ? `
      <button class="btn btn-secondary" data-pay="${s.id}">Marquer payé</button>
      <button class="btn btn-secondary" data-cancel="${s.id}">Annuler</button>
    `
          : "—"}
      </td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll("button[data-pay]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-pay");
      const sales = load(KEY_SALES);
      const s = sales.find(x => x.id === id);
      if (!s) return;

      if ((s.orderStatus ?? "active") !== "active") return;

      s.paymentStatus = "paid";
      s.paidAt = new Date().toISOString();

      save(KEY_SALES, sales);
      renderSales();
      renderSummary();
    });
  });

  body.querySelectorAll("button[data-cancel]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cancel");
      const sales = load(KEY_SALES);
      const s = sales.find(x => x.id === id);
      if (!s) return;

      const status = (s.orderStatus ?? "active");
      const pay = (s.paymentStatus ?? "pending");

      if (status !== "active" || pay !== "pending") return;

      if (!confirm("Annuler cette commande ? Le stock sera remis.")) return;

      const products = load(KEY_PRODUCTS);
      const p = products.find(x => x.id === s.productId);

      if (p) {
        p.stockQty = (p.stockQty || 0) + (s.qtySold || 0);
        p.totalCostXof = (p.totalCostXof || 0) + (s.costSoldXof || 0);
        save(KEY_PRODUCTS, products);
      } else {
        alert("Produit introuvable (supprimé). Annulation enregistrée, mais stock non restauré.");
      }

      s.orderStatus = "cancelled";
      s.cancelledAt = new Date().toISOString();

      save(KEY_SALES, sales);

      renderProducts();
      renderSales();
      renderSummary();
    });
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

function renderSummary(){
  const sales = load(KEY_SALES);

  const active = sales.filter(s => (s.orderStatus ?? "active") === "active");

  const paid = active.filter(s => (s.paymentStatus ?? "pending") === "paid");
  const pending = active.filter(s => (s.paymentStatus ?? "pending") === "pending");

  const sumPaid = paid.reduce((acc, s) => acc + (s.revenueXof || 0), 0);
  const sumPending = pending.reduce((acc, s) => acc + (s.revenueXof || 0), 0);
  const sumTotal = sumPaid + sumPending;

  const elPaid = document.getElementById("sumPaid");
  const elPending = document.getElementById("sumPending");
  const elTotal = document.getElementById("sumTotal");

  if (elPaid) elPaid.textContent = fmtXOF(sumPaid);
  if (elPending) elPending.textContent = fmtXOF(sumPending);
  if (elTotal) elTotal.textContent = fmtXOF(sumTotal);
}

// Gestion de la soumission du formulaire Vendre
if (formSale) {
  formSale.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const productId = document.getElementById("saleProductId").value;
    const qty = parseInt(document.getElementById("saleQty").value, 10);
    const priceUnit = parseFloat(document.getElementById("salePrice").value);
    const clientName = document.getElementById("saleClient").value.trim();
    const status = document.getElementById("saleStatus").value; // paid ou pending

    if (!productId || qty <= 0 || priceUnit <= 0) {
      alert("Veuillez remplir correctement tous les champs.");
      return;
    }

    const products = load(KEY_PRODUCTS);
    const p = products.find(x => x.id === productId);

    if (!p) return alert("Produit introuvable.");
    if (qty > p.stockQty) return alert("Stock insuffisant !");

    // Calculs
    const avgCostUnit = p.stockQty > 0 ? (p.totalCostXof / p.stockQty) : 0;
    const costSold = Math.round(avgCostUnit * qty);
    const revenue = priceUnit * qty;
    const profit = revenue - costSold;

    // Mise à jour Stock
    p.stockQty -= qty;
    p.totalCostXof = Math.max(0, Math.round(p.totalCostXof - costSold));
    save(KEY_PRODUCTS, products);

    // Enregistrement Vente
    const sales = load(KEY_SALES);
    sales.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      productId: p.id,
      productName: p.name,
      clientName: clientName,
      paymentStatus: status,
      paidAt: status === "paid" ? new Date().toISOString() : null,
      orderStatus: "active",
      cancelledAt: null,
      qtySold: qty,
      priceUnitXof: priceUnit,
      revenueXof: revenue,
      costSoldXof: costSold,
      profitXof: profit
    });
    save(KEY_SALES, sales);

    // Rafraîchir l'affichage
    renderProducts();
    renderSales();
    renderSummary();

    // Fermer la modale
    modalSale.classList.add("hidden");
  });
}

// Bouton Annuler de la modale
if (btnCancelSale) {
  btnCancelSale.addEventListener("click", () => {
    modalSale.classList.add("hidden");
  });
}

// Fermer en cliquant en dehors (optionnel mais sympa)
if (modalSale) {
  modalSale.addEventListener("click", (e) => {
    if (e.target === modalSale) {
      modalSale.classList.add("hidden");
    }
  });
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
    renderSummary();
  });

  renderProducts();
  renderLots();
  renderSales();
  renderSummary();
});