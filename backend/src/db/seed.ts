import "reflect-metadata";
import bcrypt from "bcrypt";
import sequelize from "./index";
import {
  User,
  Category,
  Product,
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Delivery,
  UserRating,
} from "../models";

const seed = async () => {
  try {
    console.log("Starting database seed...");

    await sequelize.sync({ force: true });
    console.log("Database synced (tables recreated)");

    const passwordHash = await bcrypt.hash("Password123!", 10);

    const users = await User.bulkCreate([
      {
        username: "admin",
        email: "admin@marketplace.pl",
        password_hash: passwordHash,
        role: "ADMIN",
      },
      {
        username: "jan_kowalski",
        email: "jan@example.pl",
        password_hash: passwordHash,
        role: "USER",
      },
      {
        username: "anna_nowak",
        email: "anna@example.pl",
        password_hash: passwordHash,
        role: "USER",
      },
      {
        username: "piotr_seller",
        email: "piotr@example.pl",
        password_hash: passwordHash,
        role: "USER",
      },
    ]);
    console.log(`Created ${users.length} users`);

    const categories = await Category.bulkCreate([
      { name: "Elektronika", description: "Telefony, komputery, tablety i akcesoria" },
      { name: "Moda", description: "Odzież, obuwie i akcesoria modowe" },
      { name: "Dom i Ogród", description: "Meble, dekoracje, narzędzia ogrodowe" },
      { name: "Sport", description: "Sprzęt sportowy i odzież sportowa" },
      { name: "Książki", description: "Książki, e-booki i audiobooki" },
    ]);
    console.log(`Created ${categories.length} categories`);

    const addresses = await Address.bulkCreate([
      {
        street: "Marszałkowska",
        street_number: "100",
        postal_code: "00-001",
        city: "Warszawa",
      },
      {
        street: "Floriańska",
        street_number: "25A",
        postal_code: "31-019",
        city: "Kraków",
      },
      {
        street: "Piotrkowska",
        street_number: "77",
        postal_code: "90-001",
        city: "Łódź",
      },
    ]);
    console.log(`Created ${addresses.length} addresses`);

    const products = await Product.bulkCreate([
      {
        name: "iPhone 15 Pro",
        description: "Najnowszy smartfon Apple z chipem A17 Pro",
        price: 5499.00,
        quantity_available: 15,
        image_urls: [
          "https://picsum.photos/seed/iphone/400/400",
          "https://picsum.photos/seed/iphone2/400/400",
          "https://picsum.photos/seed/iphone3/400/400",
        ],
        user_id: users[3].id,
        category_id: categories[0].id,
      },
      {
        name: "MacBook Air M3",
        description: "Lekki laptop z najnowszym procesorem Apple M3",
        price: 6299.00,
        quantity_available: 8,
        image_urls: [
          "https://picsum.photos/seed/macbook/400/400",
          "https://picsum.photos/seed/macbook2/400/400",
        ],
        user_id: users[3].id,
        category_id: categories[0].id,
      },
      {
        name: "Słuchawki Sony WH-1000XM5",
        description: "Bezprzewodowe słuchawki z ANC",
        price: 1499.00,
        quantity_available: 25,
        image_urls: [
          "https://picsum.photos/seed/headphones/400/400",
          "https://picsum.photos/seed/headphones2/400/400",
        ],
        user_id: users[1].id,
        category_id: categories[0].id,
      },
      {
        name: "Kurtka zimowa The North Face",
        description: "Ciepła kurtka puchowa na zimę",
        price: 899.00,
        quantity_available: 12,
        image_urls: [
          "https://picsum.photos/seed/jacket/400/400",
          "https://picsum.photos/seed/jacket2/400/400",
          "https://picsum.photos/seed/jacket3/400/400",
        ],
        user_id: users[2].id,
        category_id: categories[1].id,
      },
      {
        name: "Buty Nike Air Max",
        description: "Klasyczne sneakersy w nowoczesnym stylu",
        price: 649.00,
        quantity_available: 30,
        image_urls: [
          "https://picsum.photos/seed/shoes/400/400",
          "https://picsum.photos/seed/shoes2/400/400",
        ],
        user_id: users[2].id,
        category_id: categories[1].id,
      },
      {
        name: "Sofa narożna IKEA",
        description: "Wygodna sofa rozkładana z funkcją spania",
        price: 2499.00,
        quantity_available: 5,
        image_urls: [
          "https://picsum.photos/seed/sofa/400/400",
          "https://picsum.photos/seed/sofa2/400/400",
        ],
        user_id: users[1].id,
        category_id: categories[2].id,
      },
      {
        name: "Robot koszący Husqvarna",
        description: "Automatyczny robot do koszenia trawnika",
        price: 4599.00,
        quantity_available: 3,
        image_urls: ["https://picsum.photos/seed/robot/400/400"],
        user_id: users[3].id,
        category_id: categories[2].id,
      },
      {
        name: "Rower górski Giant",
        description: "Profesjonalny rower MTB z amortyzacją",
        price: 3299.00,
        quantity_available: 7,
        image_urls: [
          "https://picsum.photos/seed/bike/400/400",
          "https://picsum.photos/seed/bike2/400/400",
          "https://picsum.photos/seed/bike3/400/400",
        ],
        user_id: users[1].id,
        category_id: categories[3].id,
      },
      {
        name: "Mata do jogi",
        description: "Antypoślizgowa mata premium 6mm",
        price: 129.00,
        quantity_available: 50,
        image_urls: ["https://picsum.photos/seed/yogamat/400/400"],
        user_id: users[2].id,
        category_id: categories[3].id,
      },
      {
        name: "Clean Code - Robert C. Martin",
        description: "Kultowa książka o pisaniu czystego kodu",
        price: 89.00,
        quantity_available: 100,
        image_urls: ["https://picsum.photos/seed/book1/400/400"],
        user_id: users[1].id,
        category_id: categories[4].id,
      },
      {
        name: "iPad Pro 12.9",
        description: "Tablet Apple z ekranem Liquid Retina",
        price: 5199.00,
        quantity_available: 10,
        image_urls: [
          "https://picsum.photos/seed/ipad/400/400",
          "https://picsum.photos/seed/ipad2/400/400",
        ],
        user_id: users[3].id,
        category_id: categories[0].id,
      },
      {
        name: "Samsung Galaxy S24",
        description: "Flagowy smartfon Samsunga",
        price: 4999.00,
        quantity_available: 18,
        image_urls: [
          "https://picsum.photos/seed/galaxy/400/400",
          "https://picsum.photos/seed/galaxy2/400/400",
        ],
        user_id: users[2].id,
        category_id: categories[0].id,
      },
      {
        name: "Monitor LG 27'' 4K",
        description: "Monitor 4K UHD do pracy i gier",
        price: 1799.00,
        quantity_available: 14,
        image_urls: [
          "https://picsum.photos/seed/monitor/400/400",
          "https://picsum.photos/seed/monitor2/400/400",
        ],
        user_id: users[1].id,
        category_id: categories[0].id,
      },
      {
        name: "Bluza Adidas",
        description: "Sportowa bluza z kapturem",
        price: 299.00,
        quantity_available: 40,
        image_urls: [
          "https://picsum.photos/seed/bluza/400/400",
          "https://picsum.photos/seed/bluza2/400/400",
        ],
        user_id: users[2].id,
        category_id: categories[1].id,
      },
      {
        name: "Spodnie jeans Levi's",
        description: "Klasyczne jeansy slim fit",
        price: 349.00,
        quantity_available: 22,
        image_urls: ["https://picsum.photos/seed/jeans/400/400"],
        user_id: users[1].id,
        category_id: categories[1].id,
      },
      {
        name: "Koszulka Puma",
        description: "Oddychająca koszulka sportowa",
        price: 119.00,
        quantity_available: 60,
        image_urls: ["https://picsum.photos/seed/tshirt/400/400"],
        user_id: users[2].id,
        category_id: categories[1].id,
      },
      {
        name: "Stół drewniany",
        description: "Nowoczesny stół do jadalni",
        price: 1299.00,
        quantity_available: 6,
        image_urls: [
          "https://picsum.photos/seed/table/400/400",
          "https://picsum.photos/seed/table2/400/400",
        ],
        user_id: users[3].id,
        category_id: categories[2].id,
      },
      {
        name: "Krzesło biurowe",
        description: "Ergonomiczne krzesło z regulacją",
        price: 799.00,
        quantity_available: 15,
        image_urls: [
          "https://picsum.photos/seed/chair/400/400",
          "https://picsum.photos/seed/chair2/400/400",
        ],
        user_id: users[1].id,
        category_id: categories[2].id,
      },
      {
        name: "Lampa stojąca",
        description: "Nowoczesna lampa LED",
        price: 249.00,
        quantity_available: 20,
        image_urls: ["https://picsum.photos/seed/lamp/400/400"],
        user_id: users[2].id,
        category_id: categories[2].id,
      },
      {
        name: "Hantle 10kg",
        description: "Zestaw hantli do treningu siłowego",
        price: 199.00,
        quantity_available: 35,
        image_urls: ["https://picsum.photos/seed/dumbbell/400/400"],
        user_id: users[3].id,
        category_id: categories[3].id,
      },
      {
        name: "Bieżnia elektryczna",
        description: "Domowa bieżnia z wyświetlaczem LCD",
        price: 2999.00,
        quantity_available: 4,
        image_urls: [
          "https://picsum.photos/seed/treadmill/400/400",
          "https://picsum.photos/seed/treadmill2/400/400",
        ],
        user_id: users[1].id,
        category_id: categories[3].id,
      },
      {
        name: "Piłka nożna Adidas",
        description: "Oficjalna piłka meczowa",
        price: 159.00,
        quantity_available: 45,
        image_urls: ["https://picsum.photos/seed/ball/400/400"],
        user_id: users[2].id,
        category_id: categories[3].id,
      },
      {
        name: "Atomic Habits - James Clear",
        description: "Książka o budowaniu dobrych nawyków",
        price: 79.00,
        quantity_available: 120,
        image_urls: ["https://picsum.photos/seed/book2/400/400"],
        user_id: users[1].id,
        category_id: categories[4].id,
      },
      {
        name: "Design Patterns - GoF",
        description: "Klasyka wzorców projektowych",
        price: 129.00,
        quantity_available: 70,
        image_urls: ["https://picsum.photos/seed/book3/400/400"],
        user_id: users[3].id,
        category_id: categories[4].id,
      },
      {
        name: "You Don't Know JS",
        description: "Seria książek o JavaScript",
        price: 99.00,
        quantity_available: 85,
        image_urls: ["https://picsum.photos/seed/book4/400/400"],
        user_id: users[2].id,
        category_id: categories[4].id,
      },
      {
        name: "PlayStation 5",
        description: "Konsola nowej generacji Sony",
        price: 2699.00,
        quantity_available: 9,
        image_urls: [
          "https://picsum.photos/seed/ps5/400/400",
          "https://picsum.photos/seed/ps5b/400/400",
          "https://picsum.photos/seed/ps5c/400/400",
        ],
        user_id: users[3].id,
        category_id: categories[0].id,
      },
      {
        name: "Xbox Series X",
        description: "Konsola Microsoft 4K",
        price: 2599.00,
        quantity_available: 11,
        image_urls: [
          "https://picsum.photos/seed/xbox/400/400",
          "https://picsum.photos/seed/xbox2/400/400",
        ],
        user_id: users[1].id,
        category_id: categories[0].id,
      },
      {
        name: "Apple Watch Series 9",
        description: "Smartwatch z GPS",
        price: 2199.00,
        quantity_available: 16,
        image_urls: [
          "https://picsum.photos/seed/watch/400/400",
          "https://picsum.photos/seed/watch2/400/400",
        ],
        user_id: users[2].id,
        category_id: categories[0].id,
      },
      {
        name: "Okulary Ray-Ban",
        description: "Stylowe okulary przeciwsłoneczne",
        price: 599.00,
        quantity_available: 25,
        image_urls: [
          "https://picsum.photos/seed/glasses/400/400",
          "https://picsum.photos/seed/glasses2/400/400",
        ],
        user_id: users[2].id,
        category_id: categories[1].id,
      },
      {
        name: "Szafa przesuwna",
        description: "Duża szafa z lustrem",
        price: 1899.00,
        quantity_available: 7,
        image_urls: [
          "https://picsum.photos/seed/wardrobe/400/400",
          "https://picsum.photos/seed/wardrobe2/400/400",
        ],
        user_id: users[3].id,
        category_id: categories[2].id,
      },
      {
        name: "Orbitrek magnetyczny",
        description: "Sprzęt cardio do domu",
        price: 1999.00,
        quantity_available: 6,
        image_urls: ["https://picsum.photos/seed/orbitrek/400/400"],
        user_id: users[1].id,
        category_id: categories[3].id,
      },
      {
        name: "Gitara akustyczna Yamaha",
        description: "Gitara dla początkujących i średniozaawansowanych",
        price: 899.00,
        quantity_available: 13,
        image_urls: [
          "https://picsum.photos/seed/guitar/400/400",
          "https://picsum.photos/seed/guitar2/400/400",
        ],
        user_id: users[2].id,
        category_id: categories[3].id,
      },
      {
        name: "Kindle Paperwhite",
        description: "Czytnik ebooków z podświetleniem",
        price: 649.00,
        quantity_available: 20,
        image_urls: ["https://picsum.photos/seed/kindle/400/400"],
        user_id: users[3].id,
        category_id: categories[0].id,
      },
      {
        name: "Poduszka ortopedyczna",
        description: "Poduszka z pianki memory",
        price: 149.00,
        quantity_available: 55,
        image_urls: ["https://picsum.photos/seed/pillow/400/400"],
        user_id: users[1].id,
        category_id: categories[2].id,
      },
      {
        name: "Drukarka HP LaserJet",
        description: "Drukarka laserowa do biura",
        price: 899.00,
        quantity_available: 12,
        image_urls: [
          "https://picsum.photos/seed/printer/400/400",
          "https://picsum.photos/seed/printer2/400/400",
        ],
        user_id: users[2].id,
        category_id: categories[0].id,
      },
      {
        name: "Plecak turystyczny 40L",
        description: "Wytrzymały plecak na wyprawy",
        price: 399.00,
        quantity_available: 28,
        image_urls: [
          "https://picsum.photos/seed/backpack/400/400",
          "https://picsum.photos/seed/backpack2/400/400",
        ],
        user_id: users[3].id,
        category_id: categories[3].id,
      },
    ]);
    console.log(`Created ${products.length} products`);

    // const carts = await Cart.bulkCreate([
    //   { user_id: users[1].id },
    //   { user_id: users[2].id },
    // ]);
    // console.log(`Created ${carts.length} carts`);

    // await CartItem.bulkCreate([
    //   { cart_id: carts[0].id, product_id: products[0].id, quantity: 1 },
    //   { cart_id: carts[0].id, product_id: products[2].id, quantity: 2 },
    //   { cart_id: carts[1].id, product_id: products[4].id, quantity: 1 },
    // ]);
    // console.log(`Created 3 cart items`);

    const orders = await Order.bulkCreate([
      {
        buyer_id: users[1].id,
        seller_id: users[3].id,
        total_amount: 11798.00,
        status: "COMPLETED",
      },
      {
        buyer_id: users[2].id,
        seller_id: users[1].id,
        total_amount: 3998.00,
        status: "PROCESSING",
      },
      {
        buyer_id: users[2].id,
        seller_id: users[3].id,
        total_amount: 2699.00,
        status: "PENDING",
      },
      {
        buyer_id: users[1].id,
        seller_id: null,
        total_amount: 6398.00,
        status: "PROCESSING",
      },
    ]);
    console.log(`Created ${orders.length} orders`);

    await OrderItem.bulkCreate([
      {
        order_id: orders[0].id,
        product_id: products[0].id,
        quantity: 1,
        price_per_unit: 5499.00,
      },
      {
        order_id: orders[0].id,
        product_id: products[1].id,
        quantity: 1,
        price_per_unit: 6299.00,
      },
      {
        order_id: orders[1].id,
        product_id: products[2].id,
        quantity: 1,
        price_per_unit: 1499.00,
      },
      {
        order_id: orders[1].id,
        product_id: products[5].id,
        quantity: 1,
        price_per_unit: 2499.00,
      },
      {
        order_id: orders[2].id,
        product_id: products[25].id,
        quantity: 1,
        price_per_unit: 2699.00,
      },
      {
        order_id: orders[3].id,
        product_id: products[0].id,
        quantity: 1,
        price_per_unit: 5499.00,
      },
      {
        order_id: orders[3].id,
        product_id: products[3].id,
        quantity: 1,
        price_per_unit: 899.00,
      },
    ]);
    console.log(`Created 7 order items`);

    await Payment.bulkCreate([
      {
        order_id: orders[0].id,
        amount: 11798.00,
        status: "PAID",
        payment_gateway_id: "pay_completed_12345",
      },
      {
        order_id: orders[1].id,
        amount: 3998.00,
        status: "PAID",
        payment_gateway_id: "pay_processing_67890",
      },
      {
        order_id: orders[2].id,
        amount: 2699.00,
        status: "PENDING",
      },
      {
        order_id: orders[3].id,
        amount: 6398.00,
        status: "PAID",
        payment_gateway_id: "pay_mixed_11111",
      },
    ]);
    console.log(`Created 4 payments`);

    await Delivery.bulkCreate([
      {
        order_id: orders[0].id,
        address_id: addresses[0].id,
        status: "DELIVERED",
        tracking_number: "PL123456789012",
      },
      {
        order_id: orders[1].id,
        address_id: addresses[1].id,
        status: "IN_TRANSIT",
        tracking_number: "PL987654321098",
      },
      {
        order_id: orders[2].id,
        address_id: addresses[2].id,
        status: "PREPARING",
      },
      {
        order_id: orders[3].id,
        address_id: addresses[0].id,
        status: "SHIPPED",
        tracking_number: "PL555444333222",
      },
    ]);
    console.log(`Created 4 deliveries`);

    // orders[0] is COMPLETED — buyer: users[1], seller: users[3]
    await UserRating.bulkCreate([
      {
        reviewee_id: users[3].id,
        reviewer_id: users[1].id,
        order_id: orders[0].id,
        rating: 5,
        comment: "Szybka wysyłka, produkt zgodny z opisem. Polecam!",
      },
    ]);
    await users[3].update({ avg_rating: 5.00, ratings_count: 1 });
    console.log("Created 1 user rating");

    console.log("\nDatabase seeded successfully!");
    console.log("\nTest credentials:");
    console.log("   Admin:  admin@marketplace.pl / Password123!");
    console.log("   Buyer:  jan@example.pl / Password123!");
    console.log("   Seller: piotr@example.pl / Password123!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
