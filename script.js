/* RackRight Warehousing - script.js
   1) Dashboard KPIs, charts and stock-out table (sample data)
   2) Business feature: Track an order by Order ID
   3) Mobile menu and "Request quote" links */

/* ---------- Sample data (edit these to change the dashboard) ---------- */
const week = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  received:   [160, 175, 190, 185, 210, 170, 160],
  dispatched: [140, 150, 165, 170, 185, 150, 120]
};

const zones = [
  { name: "Ambient racking", used: 1820, capacity: 2000 },
  { name: "Fast-pick area",  used: 440,  capacity: 500 },
  { name: "Bulk floor",      used: 780,  capacity: 1000 },
  { name: "Controlled temp", used: 345,  capacity: 500 },
  { name: "Returns bay",     used: 108,  capacity: 200 }
];

const stockouts = [
  { sku: "SKU-1042", item: "Cotton T-shirt, Navy, M", client: "UrbanThread", waiting: 38 },
  { sku: "SKU-2210", item: "Steel water bottle 750 ml", client: "HydroHaus", waiting: 27 },
  { sku: "SKU-3305", item: "Herbal tea, 100 g pack", client: "LeafLane", waiting: 22 },
  { sku: "SKU-0877", item: "Phone case, Model X", client: "CaseCraft", waiting: 19 },
  { sku: "SKU-4120", item: "Notebook A5, ruled", client: "PaperPost", waiting: 11 }
];
const TOTAL_STOCKOUT_ITEMS = 14;

const orders = {
  TRK1021: { customer: "Aarav Mehta", items: "2 items", client: "UrbanThread", stage: 4, location: "Delivered to customer", eta: "Delivered on 12 Oct, 4:10 pm", partner: "BlueDart" },
  TRK1022: { customer: "Isha Nair", items: "1 item", client: "HydroHaus", stage: 3, location: "Dispatch dock, Bay 3", eta: "Today, 6:00 pm", partner: "Delhivery" },
  TRK1023: { customer: "Rohan Kulkarni", items: "4 items", client: "LeafLane", stage: 2, location: "Packing station 5", eta: "Tomorrow, 11:00 am", partner: "Ecom Express" },
  TRK1024: { customer: "Neha Shah", items: "3 items", client: "CaseCraft", stage: 1, location: "Fast-pick area, Aisle B", eta: "Tomorrow, 2:00 pm", partner: "Delhivery" },
  TRK1025: { customer: "Kabir Desai", items: "5 items", client: "PaperPost", stage: 3, location: "Out for dispatch, Truck MH-43-AB-2210", eta: "Today, 7:30 pm", partner: "BlueDart" },
  TRK1026: { customer: "Meera Joshi", items: "1 item", client: "UrbanThread", stage: 0, location: "Order received, awaiting picking", eta: "Tomorrow, 5:00 pm", partner: "Ecom Express" },
  TRK1027: { customer: "Vikram Rao", items: "2 items", client: "HydroHaus", stage: 1, location: "Waiting for stock", eta: "Revised: 16 Oct", partner: "Delhivery", delayed: true, reason: "SKU-2210 is out of stock. Replenishment arrives on 15 Oct." },
  TRK1028: { customer: "Sana Qureshi", items: "3 items", client: "LeafLane", stage: 4, location: "Delivered to customer", eta: "Delivered on 13 Oct, 1:25 pm", partner: "BlueDart" },
  TRK1029: { customer: "Dev Patel", items: "1 item", client: "CaseCraft", stage: 2, location: "Packing station 2", eta: "Today, 8:00 pm", partner: "Delhivery" },
  TRK1030: { customer: "Anjali Verma", items: "6 items", client: "PaperPost", stage: 2, location: "Packing station 4", eta: "Revised: tomorrow, 6:00 pm", partner: "Ecom Express", delayed: true, reason: "Packing delayed by a damaged carton. Order is being repacked." }
};
const STAGES = ["Received", "Picked", "Packed", "Dispatched", "Delivered"];

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString("en-IN");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- 1. Dashboard ---------- */
function renderKpis() {
  const received = week.received.reduce((a, b) => a + b, 0);
  const dispatched = week.dispatched.reduce((a, b) => a + b, 0);
  const used = zones.reduce((a, z) => a + z.used, 0);
  const cap = zones.reduce((a, z) => a + z.capacity, 0);
  const util = (used / cap) * 100;

  const kpis = [
    { label: "Inventory on hand", value: fmt(48250), hint: "units across 1,860 SKUs", cls: "" },
    { label: "Orders received", value: fmt(received), hint: "this week", cls: "" },
    { label: "Orders dispatched", value: fmt(dispatched), hint: ((dispatched / received) * 100).toFixed(1) + "% of received", cls: "good" },
    { label: "Pending orders", value: fmt(received - dispatched), hint: "still to ship", cls: "" },
    { label: "Stock-out items", value: String(TOTAL_STOCKOUT_ITEMS), hint: "SKUs at zero", cls: "warn" },
    { label: "Warehouse utilisation", value: util.toFixed(1) + "%", hint: fmt(used) + " of " + fmt(cap) + " pallet positions", cls: util > 90 ? "warn" : "" }
  ];

  $("kpis").innerHTML = kpis.map((k) =>
    `<div class="kpi ${k.cls}"><p class="label">${k.label}</p><p class="value">${k.value}</p><p class="hint">${k.hint}</p></div>`
  ).join("");
}

function renderWeekChart() {
  const W = 600, H = 300, L = 44, B = 32, T = 12, R = 8;
  const max = 250, plotH = H - B - T, plotW = W - L - R;
  const groupW = plotW / week.days.length, barW = groupW * 0.32;
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;

  for (let v = 0; v <= max; v += 50) {
    const y = T + plotH - (v / max) * plotH;
    svg += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="#D5D9D7"/>`;
    svg += `<text x="${L - 8}" y="${y + 4}" text-anchor="end" font-size="12" fill="#4A5860">${v}</text>`;
  }
  week.days.forEach((d, i) => {
    const x0 = L + i * groupW + groupW / 2 - barW - 1;
    const hr = (week.received[i] / max) * plotH;
    const hd = (week.dispatched[i] / max) * plotH;
    svg += `<rect x="${x0}" y="${T + plotH - hr}" width="${barW}" height="${hr}" fill="#3F6C8C"><title>${d}: ${week.received[i]} received</title></rect>`;
    svg += `<rect x="${x0 + barW + 2}" y="${T + plotH - hd}" width="${barW}" height="${hd}" fill="#FFC20E" stroke="#1F2A30"><title>${d}: ${week.dispatched[i]} dispatched</title></rect>`;
    svg += `<text x="${L + i * groupW + groupW / 2}" y="${H - 10}" text-anchor="middle" font-size="13" fill="#1F2A30">${d}</text>`;
  });
  svg += `</svg>`;
  $("weekChart").innerHTML = svg;
}

function renderZoneChart() {
  const W = 480, rowH = 52, H = zones.length * rowH + 8, labelW = 0, barX = 0, barW = W;
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
  zones.forEach((z, i) => {
    const pct = (z.used / z.capacity) * 100;
    const y = i * rowH + 6;
    const color = pct >= 90 ? "#C8412B" : pct >= 80 ? "#FFC20E" : "#2E7D5B";
    svg += `<text x="${barX}" y="${y + 14}" font-size="14" fill="#1F2A30">${z.name}</text>`;
    svg += `<text x="${W}" y="${y + 14}" font-size="14" font-weight="600" text-anchor="end" fill="#1F2A30">${pct.toFixed(0)}%</text>`;
    svg += `<rect x="${barX}" y="${y + 22}" width="${barW}" height="16" fill="#E9EBEA"/>`;
    svg += `<rect x="${barX}" y="${y + 22}" width="${(barW * pct) / 100}" height="16" fill="${color}" stroke="#1F2A30"><title>${z.name}: ${z.used} of ${z.capacity} positions used</title></rect>`;
  });
  svg += `</svg>`;
  $("zoneChart").innerHTML = svg;
}

function renderStockouts() {
  const rows = stockouts.map((s) =>
    `<tr><td>${esc(s.sku)}</td><td>${esc(s.item)}</td><td>${esc(s.client)}</td><td>${s.waiting}</td></tr>`
  ).join("");
  const more = TOTAL_STOCKOUT_ITEMS - stockouts.length;
  $("stockoutTable").querySelector("tbody").innerHTML =
    rows + `<tr><td colspan="4">Showing ${stockouts.length} of ${TOTAL_STOCKOUT_ITEMS} stock-out items (${more} more with fewer than 10 orders waiting).</td></tr>`;
}

/* ---------- 2. Business feature: Track an order ---------- */
function trackOrder(rawId) {
  const id = rawId.trim().toUpperCase();
  const out = $("trackResult");

  if (!id) {
    out.innerHTML = `<div class="card error"><p>Enter an order ID, for example TRK1025.</p></div>`;
    return;
  }
  const o = orders[id];
  if (!o) {
    out.innerHTML = `<div class="card error"><p>No order found for <strong>${esc(id)}</strong>. Check the ID on your confirmation email. Valid sample IDs run from TRK1021 to TRK1030.</p></div>`;
    return;
  }

  const status = o.delayed ? "Delayed" : STAGES[o.stage];
  const badgeCls = o.delayed ? "delayed" : o.stage === 4 ? "delivered" : "";
  const steps = STAGES.map((s, i) => {
    let cls = "";
    if (i < o.stage) cls = "done";
    else if (i === o.stage) cls = o.delayed ? "stuck" : o.stage === 4 ? "done" : "current";
    return `<li class="${cls}">${s}</li>`;
  }).join("");

  out.innerHTML = `
    <div class="card">
      <h3>${esc(id)} <span class="badge ${badgeCls}">Status: ${status}</span></h3>
      <dl class="detail">
        <div><dt>Customer</dt><dd>${esc(o.customer)}</dd></div>
        <div><dt>Items</dt><dd>${esc(o.items)} from ${esc(o.client)}</dd></div>
        <div><dt>Current location</dt><dd>${esc(o.location)}</dd></div>
        <div><dt>Expected delivery</dt><dd>${esc(o.eta)}</dd></div>
        <div><dt>Courier partner</dt><dd>${esc(o.partner)}</dd></div>
        <div><dt>Questions?</dt><dd><a href="#contact">Contact the warehouse</a></dd></div>
      </dl>
      <ol class="steps" aria-label="Order progress">${steps}</ol>
      ${o.delayed ? `<p class="delay-note"><strong>Why it is delayed:</strong> ${esc(o.reason)}</p>` : ""}
    </div>`;
}

/* ---------- 3. Page wiring ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderKpis();
  renderWeekChart();
  renderZoneChart();
  renderStockouts();

  $("trackForm").addEventListener("submit", (e) => {
    e.preventDefault();
    trackOrder($("orderId").value);
  });
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $("orderId").value = chip.dataset.id;
      trackOrder(chip.dataset.id);
    });
  });

  // "Request quote" links jump to Contact and add the chosen service to the enquiry email.
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const service = link.dataset.service;
      $("enquiryBtn").href =
        "mailto:hello@rackright.example?subject=" + encodeURIComponent("Quote request: " + service) +
        "&body=" + encodeURIComponent("Name:\nCompany:\nMonthly orders:\nService needed: " + service + "\n");
    });
  });

  // Mobile menu
  const btn = $("menuBtn"), nav = $("nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }));
});
