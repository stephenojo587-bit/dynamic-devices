const K = 1000;
const PRODUCTS = [];

// [name, price in thousands]. Use 0 for out of stock.
const add = (cat, list) =>
  list.forEach(([name, k, opt]) =>
    PRODUCTS.push({
      id: cat + "-" + PRODUCTS.length,
      cat, name,
      price: k ? k * K : null,
      stock: k !== 0,
      ...(opt || {}),
    })
  );

add("iphone", [
  ["iPhone 6 16GB", 70],
  ["iPhone 6 Plus 64GB", 90],
  ["iPhone 6s Plus 32GB", 100],
  ["iPhone 6s Plus 64GB", 110],
  ["iPhone 7 32GB", 100],
  ["iPhone 7 128GB", 110],
  ["iPhone 7 Plus 32GB", 120],
  ["iPhone 7 Plus 128GB", 125],
  ["iPhone 8 64GB", 135],
  ["iPhone SE 64GB", 160],
  ["iPhone XR 64GB", 225],
  ["iPhone XR 128GB", 245],
  ["iPhone XS Max 64GB", 265],
  ["iPhone XS Max 256GB", 285],
  ["iPhone 11 64GB", 265],
  ["iPhone 11 128GB", 290],
  ["iPhone 11 Pro 64GB", 310],
  ["iPhone 11 Pro 256GB", 335],
  ["iPhone 11 Pro Max 64GB", 345],
  ["iPhone 11 Pro Max 256GB", 370],
  ["iPhone 12 64GB", 300],
  ["iPhone 12 128GB", 320],
  ["iPhone 12 Pro 128GB", 390],
  ["iPhone 12 Pro 256GB", 425],
  ["iPhone 12 Pro Max 128GB", 460],
  ["iPhone 12 Pro Max 256GB", 500],
  ["iPhone 13 128GB", 390],
  ["iPhone 13 Pro 128GB", 520],
  ["iPhone 14 128GB", 0],
  ["iPhone 14 Pro 128GB (LLA)", 640],
]);

add("samsung", [
  ["Samsung Galaxy A51 5G", 180],
  ["Samsung Galaxy A82 5G 6/128GB", 215],
  ["Samsung Galaxy S8", 170],
  ["Samsung Galaxy S9", 175],
  ["Samsung Galaxy S8+", 185],
  ["Samsung Galaxy S9+", 200],
  ["Samsung Galaxy S10", 245],
  ["Samsung Galaxy S10+", 275],
  ["Samsung Galaxy S20", 245],
  ["Samsung Galaxy S21 128GB", 260],
  ["Samsung Galaxy S21 256GB", 275],
  ["Samsung Galaxy S21+ 128GB", 275],
  ["Samsung Galaxy S21 FE", 210],
  ["Samsung Galaxy S20 Ultra 128GB", 300],
  ["Samsung Galaxy S21 Ultra 128GB", 345],
  ["Samsung Galaxy S21 Ultra 256GB", 410],
  ["Samsung Galaxy S22 128GB", 300],
  ["Samsung Galaxy S22 Ultra 128GB", 440, { pen: 30000 }],
  ["Samsung Galaxy S22 Ultra 256GB", 500, { pen: 30000 }],
  ["Samsung Galaxy Note 8", 190],
  ["Samsung Galaxy Note 9", 250],
  ["Samsung Galaxy Note 10", 260],
  ["Samsung Galaxy Note 10+", 320],
]);

// Laptops: no price, customers ask on WhatsApp
[
  ["HP EliteBook 840 G5", "Core i5 8th gen, 8GB RAM, 256GB SSD, 14 inch"],
  ["HP EliteBook 840 G7", "Core i5 10th gen, 16GB RAM, 512GB SSD, 14 inch"],
  ["HP ProBook 450 G8", "Core i5 11th gen, 16GB RAM, 512GB SSD, 15.6 inch"],
  ["Dell Latitude 5490", "Core i5 8th gen, 8GB RAM, 256GB SSD, 14 inch"],
  ["Dell Latitude 5420", "Core i5 11th gen, 16GB RAM, 512GB SSD, 14 inch"],
  ["Dell XPS 13", "Core i7, 16GB RAM, 512GB SSD, touch display"],
  ["MacBook Air M1 (2020)", "8GB RAM, 256GB SSD"],
  ["MacBook Air M1 (2020)", "8GB RAM, 512GB SSD"],
  ["MacBook Air M2 (2022)", "8GB RAM, 256GB SSD"],
  ["MacBook Pro 13 inch M1", "8GB RAM, 256GB SSD"],
  ["MacBook Pro 14 inch M1 Pro", "16GB RAM, 512GB SSD"],
  ["Asus Vivobook 15", "Core i5 12th gen, 8GB RAM, 512GB SSD"],
  ["Asus TUF Gaming F15", "Core i5 11th gen, 16GB RAM, 512GB SSD, RTX 3050"],
].forEach(([name, specs]) =>
  PRODUCTS.push({ id: "laptop-" + PRODUCTS.length, cat: "laptop", name, specs, price: null, stock: true })
);