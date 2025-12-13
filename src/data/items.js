// Example marketplace data (100+ items)
// Keys in English, values in Polish
// Items generated programmatically for easy scaling

const categories = [
  "Elektronika",
  "Dom i ogród",
  "Moda",
  "Sport",
  "Motoryzacja",
  "Gaming",
  "Książki"
];

const sellers = [
  "TechStore",
  "HomePlus",
  "JanKowalski",
  "MarketPro",
  "ElectroWorld",
  "AutoKomis",
  "BookStore",
  "GameZone"
];

const locations = [
  "Warszawa",
  "Kraków",
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Katowice",
  "Łódź",
  "Online"
];

const sampleNames = {
  Elektronika: "Produkt elektroniczny",
  "Dom i ogród": "Produkt do domu",
  Moda: "Element garderoby",
  Sport: "Sprzęt sportowy",
  Motoryzacja: "Część samochodowa",
  Gaming: "Akcesorium gamingowe",
  Książki: "Książka"
};

const marketplaceItems = Array.from({ length: 120 }, (_, index) => {
  const category = categories[index % categories.length];

  return {
    id: index + 1,
    name: `${sampleNames[category]} #${index + 1}`,
    category,
    price: Number((Math.random() * 5000 + 50).toFixed(2)),
    currency: "PLN",
    description: `Opis przykładowy dla ${sampleNames[category].toLowerCase()} numer ${index + 1}.`,
    condition: index % 3 === 0 ? "Używany" : "Nowy",
    seller: sellers[index % sellers.length],
    location: locations[index % locations.length],
    createdAt: `2025-0${(index % 9) + 1}-${String((index % 28) + 1).padStart(2, "0")}`,
    deliveryAvailable: index % 4 !== 0,
    images: [
      `https://picsum.photos/seed/item-${index + 1}/600/400`,
      `https://picsum.photos/seed/item-${index + 1}-2/600/400`
    ]
  };
});

export default marketplaceItems;
