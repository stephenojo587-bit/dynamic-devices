const fmt = (n) => "₦" + n.toLocaleString("en-NG");
let cat = (location.search.match(/cat=([a-z]+)/) || [])[1] || "all";
let query = "";
const pen = {};
const grid = document.getElementById("grid");
const count = document.getElementById("count");
const tabs = document.querySelectorAll(".tab");
const search = document.getElementById("search");

const wa = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const photoName = (n) => n.toLowerCase().replace(/\+/g, " plus").replace(/\s*\d+(\/\d+)?gb.*$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function art(p) {
  const n = p.name.toLowerCase();
  const g = '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F4FD1"/><stop offset="1" stop-color="#FFB90F"/></linearGradient></defs>';
  if (p.cat === "laptop") {
    const mac = n.includes("macbook");
    return `<svg viewBox="0 0 160 130" aria-hidden="true">${g}<rect x="22" y="14" width="116" height="80" rx="6" fill="${mac ? "#C9CED8" : "#2B3245"}"/><rect x="27" y="19" width="106" height="68" rx="2" fill="url(#g)"/><path d="M8 98h144l-8 12H16z" fill="${mac ? "#AEB4C0" : "#1B2130"}"/></svg>`;
  }
  let body;
  if (/iphone (6|7|8|se)/.test(n)) {
    body = '<rect x="30" y="6" width="60" height="148" rx="11" fill="#101828"/><rect x="34" y="24" width="52" height="104" fill="url(#g)"/><circle cx="60" cy="141" r="6" fill="none" stroke="#5B6475" stroke-width="1.5"/>';
  } else if (n.includes("iphone 14")) {
    body = '<rect x="30" y="6" width="60" height="148" rx="12" fill="#101828"/><rect x="34" y="10" width="52" height="140" rx="9" fill="url(#g)"/><rect x="50" y="14" width="20" height="6" rx="3" fill="#101828"/>';
  } else if (n.includes("iphone")) {
    body = '<rect x="30" y="6" width="60" height="148" rx="12" fill="#101828"/><rect x="34" y="10" width="52" height="140" rx="9" fill="url(#g)"/><rect x="48" y="10" width="24" height="7" rx="3.5" fill="#101828"/>';
  } else {
    body = '<rect x="31" y="6" width="58" height="148" rx="8" fill="#101828"/><rect x="34" y="9" width="52" height="142" rx="6" fill="url(#g)"/><circle cx="60" cy="16" r="2.5" fill="#101828"/>';
  }
  return `<svg viewBox="0 0 120 160" aria-hidden="true">${g}${body}</svg>`;
}

function card(p) {
  const extra = pen[p.id] ? p.pen : 0;
  const price = p.price ? p.price + extra : null;
  let priceHtml, bnpl = "", action;

  if (price) {
    const down = Math.round(price * 0.4);
    const weekly = Math.ceil((price - down) / 20);
    priceHtml = `<p class="price">${fmt(price)}</p>`;
    bnpl = `<p class="bnpl">Pay later: ${fmt(down)} down, then ${fmt(weekly)} a week for 20 weeks</p>`;
    action = `<button class="btn btn-yellow add" data-id="${p.id}">Add to cart</button>`;
  } else {
    let msg, label;
    if (p.stock) {
      priceHtml = `<p class="price ask">Chat for price</p>`;
      msg = `Hi Dynamic Devices, I'm interested in the ${p.name} (${p.specs}). What is the price?`;
      label = "Get price on WhatsApp";
    } else {
      priceHtml = `<p class="price ask">Out of stock</p>`;
      msg = `Hi Dynamic Devices, please tell me when the ${p.name} is back in stock.`;
      label = "Notify me";
    }
    action = `<a class="btn btn-yellow" href="${wa(msg)}" target="_blank" rel="noopener">${label}</a>`;
  }

  const penBox = p.pen
    ? `<label class="pen"><input type="checkbox" data-pen="${p.id}" ${pen[p.id] ? "checked" : ""}> Add original pen (+${fmt(p.pen)})</label>`
    : "";
  const badge = p.cat === "laptop" ? "" : `<span class="badge">UK used, Grade A++</span>`;

  return `<article class="pcard">
    <div class="pimg">${art(p)}<img src="assets/phones/${photoName(p.name)}.jpg" alt="${p.name}" loading="lazy" onerror="var t=+this.dataset.t||0;var e=['png','jpeg'];if(t<e.length){this.dataset.t=t+1;this.src=this.src.replace(/(jpg|png)$/,e[t])}else this.remove()"></div>
    ${badge}
    <h3>${p.name}</h3>
    ${p.specs ? `<p class="specs">${p.specs}</p>` : ""}
    ${priceHtml}${bnpl}${penBox}
    ${action}
  </article>`;
}

function render() {
  const list = PRODUCTS.filter(
    (p) => (cat === "all" || p.cat === cat) && p.name.toLowerCase().includes(query)
  );
  count.textContent = list.length + (list.length === 1 ? " item" : " items");
  grid.innerHTML = list.length
    ? list.map(card).join("")
    : `<p class="empty">Nothing listed here yet. <a href="${wa("Hi Dynamic Devices, what do you have in stock?")}" target="_blank" rel="noopener">Ask us on WhatsApp</a> and we will tell you what is available.</p>`;
  tabs.forEach((t) => t.classList.toggle("active", t.dataset.cat === cat));
}

tabs.forEach((t) => t.addEventListener("click", () => { cat = t.dataset.cat; render(); }));
search.addEventListener("input", () => { query = search.value.trim().toLowerCase(); render(); });
grid.addEventListener("change", (e) => {
  if (e.target.dataset.pen) { pen[e.target.dataset.pen] = e.target.checked; render(); }
});
grid.addEventListener("click", (e) => {
  const b = e.target.closest(".add");
  if (!b) return;
  const p = PRODUCTS.find((x) => x.id === b.dataset.id);
  const withPen = !!pen[p.id];
  Cart.add({
    key: p.id + (withPen ? "-pen" : ""),
    name: p.name + (withPen ? " + original pen" : ""),
    price: p.price + (withPen ? p.pen : 0),
  });
  b.textContent = "Added ✓";
  setTimeout(() => (b.textContent = "Add to cart"), 1200);
});
render();