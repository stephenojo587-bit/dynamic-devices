const CART_KEY = "dd_cart";
const Cart = {
  get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } },
  save(items) { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {} Cart.badge(); },
  add(item) {
    const items = Cart.get();
    const found = items.find((i) => i.key === item.key);
    if (found) found.qty += 1; else items.push({ ...item, qty: 1 });
    Cart.save(items);
  },
  count() { return Cart.get().reduce((n, i) => n + i.qty, 0); },
  badge() { const el = document.getElementById("cartCount"); if (el) el.textContent = Cart.count(); },
};

if (!document.getElementById("checkout")) {
  const a = document.createElement("a");
  a.className = "cart-float";
  a.href = "checkout.html";
  a.innerHTML = 'Cart (<span id="cartCount">0</span>)';
  document.body.appendChild(a);
}
Cart.badge();