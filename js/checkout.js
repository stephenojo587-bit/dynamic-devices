const fmt = (n) => "₦" + n.toLocaleString("en-NG");
const $ = (id) => document.getElementById(id);
const val = (name) => (document.querySelector(`input[name="${name}"]:checked`) || {}).value;
const ZONES = {
  lagos: ["Within Lagos", 8000],
  ng: ["Outside Lagos (within Nigeria)", 15000],
  flight: ["Outside Nigeria, by flight", 30000],
  road: ["Outside Nigeria, by road", 25000],
};
$("zone").innerHTML = Object.entries(ZONES)
  .map(([k, v]) => `<option value="${k}">${v[0]}: ${fmt(v[1])}</option>`).join("");

function totals() {
  const items = Cart.get();
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = val("method") === "delivery" ? ZONES[$("zone").value][1] : 0;
  const later = val("pay") === "later";
  const down = later ? Math.round(sub * 0.4) : 0;
  const weekly = later ? Math.ceil((sub - down) / 20) : 0;
  const payNow = later ? down + delivery : sub + delivery;
  return { items, sub, delivery, later, down, weekly, payNow };
}

function summary() {
  const t = totals();
  $("deliveryBox").hidden = val("method") !== "delivery";
  $("laterBox").hidden = !t.later;
  let h = `<div><span>Items</span><span>${fmt(t.sub)}</span></div>`;
  h += `<div><span>Delivery</span><span>${t.delivery ? fmt(t.delivery) : "Free (pickup)"}</span></div>`;
  h += `<div class="total"><span>Order total</span><span>${fmt(t.sub + t.delivery)}</span></div>`;
  if (t.later) {
    h += `<div><span>Pay today (40% + delivery)</span><span>${fmt(t.payNow)}</span></div>`;
    h += `<div><span>Then, for 20 weeks</span><span>${fmt(t.weekly)} a week</span></div>`;
  }
  $("summary").innerHTML = h;
  $("payNote").innerHTML = `Send <strong>${fmt(t.payNow)}</strong> to:`;
}

function renderItems() {
  const items = Cart.get();
  $("items").innerHTML = items.length ?
    items.map((i, n) => `<div class="citem"><div><strong>${i.name}</strong><br>${fmt(i.price)}</div><div class="qty"><button data-a="-1" data-n="${n}" aria-label="Less">−</button><span>${i.qty}</span><button data-a="1" data-n="${n}" aria-label="More">+</button></div></div>`).join("") :
    `<p class="empty">Your cart is empty. <a href="shop.html">Browse the shop</a></p>`;
  $("form").hidden = !items.length;
  summary();
}

$("items").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const items = Cart.get();
  items[+b.dataset.n].qty += +b.dataset.a;
  Cart.save(items.filter((i) => i.qty > 0));
  renderItems();
});
$("form").addEventListener("change", summary);

$("copy").addEventListener("click", () => {
  try { navigator.clipboard.writeText("8104504589"); } catch (e) {}
  $("copy").textContent = "Copied ✓";
  setTimeout(() => ($("copy").textContent = "Copy account number"), 1500);
});

$("send").addEventListener("click", () => {
  const t = totals();
  const name = $("name").value.trim();
  const phone = $("phone").value.replace(/\D/g, "");
  const delivery = val("method") === "delivery";
  const address = $("address").value.trim();
  const nin = $("nin").value.trim();
  let err = "";
  if (!name) err = "Please enter your name.";
  else if (phone.length < 10) err = "Please enter a valid phone number.";
  else if (delivery && !address) err = "Please enter your delivery address.";
  else if (t.later && !/^\d{11}$/.test(nin)) err = "Your NIN must be exactly 11 digits.";
  $("err").textContent = err;
   if (err) { $("err").scrollIntoView({ block: "center" }); return; }
  
  const lines = t.items.map((i, n) => `${n + 1}. ${i.name} x${i.qty} - ${fmt(i.price * i.qty)}`);
  const msg = [
    "NEW ORDER - Dynamic Devices",
    `Name: ${name}`,
    `Phone: ${$("phone").value.trim()}`,
    "",
    "Items:",
    ...lines,
    "",
    `Items total: ${fmt(t.sub)}`,
    delivery ?
    `Delivery: ${ZONES[$("zone").value][0]} - ${fmt(t.delivery)}\nAddress: ${address}` :
    "Pickup at 17, Kodesho Street, Computer Village, Ikeja",
    `Order total: ${fmt(t.sub + t.delivery)}`,
    "",
    t.later ?
    `Payment: Buy Now Pay Later\nNIN: ${nin}\nDown payment plus delivery: ${fmt(t.payNow)}\nThen ${fmt(t.weekly)} a week for 20 weeks` :
    `Payment: Bank transfer of ${fmt(t.payNow)}`,
    "",
    "I will send my proof of payment here.",
  ].join("\n");
  
  location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
 
});

renderItems();