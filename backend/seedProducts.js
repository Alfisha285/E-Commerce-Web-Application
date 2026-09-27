const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [

    // =====================================================
    // CLOTHING — 6 PRODUCTS
    // =====================================================

    {
        name: "Satin Slip Dress",
        description: "An elegant satin slip dress with a fluid silhouette and refined finish.",
        price: 2499,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=90",
        stock: 18
    },

    {
        name: "Classic Tailored Blazer",
        description: "A structured blazer with a clean tailored silhouette for effortless dressing.",
        price: 3299,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=90",
        stock: 14
    },

    {
        name: "Essential Knit Top",
        description: "A refined everyday knit top with a soft texture and minimalist silhouette.",
        price: 1499,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=90",
        stock: 25
    },

    {
        name: "Relaxed Linen Shirt",
        description: "A lightweight linen shirt designed for relaxed and sophisticated everyday styling.",
        price: 1899,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=900&q=90",
        stock: 22
    },

    {
        name: "Minimal Black Dress",
        description: "A timeless black dress with a clean silhouette made for day-to-evening styling.",
        price: 2799,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=90",
        stock: 16
    },

    {
        name: "Soft Oversized Knit",
        description: "A softly structured oversized knit designed for understated seasonal layering.",
        price: 2199,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=90",
        stock: 20
    },


    // =====================================================
    // MAKEUP — 6 PRODUCTS
    // =====================================================

    {
        name: "Velvet Matte Lip Color",
        description: "A rich matte lip color with smooth application and a sophisticated finish.",
        price: 899,
        category: "Makeup",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=90",
        stock: 32
    },

    {
        name: "Luminous Foundation",
        description: "A lightweight foundation designed to create a natural-looking luminous complexion.",
        price: 1599,
        category: "Makeup",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=90",
        stock: 20
    },

    {
        name: "Rose Glow Blush",
        description: "A soft buildable blush that adds a natural rose-toned glow to the cheeks.",
        price: 799,
        category: "Makeup",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=90",
        stock: 27
    },

    {
        name: "Nude Eye Palette",
        description: "A versatile collection of neutral tones for effortless everyday eye looks.",
        price: 1299,
        category: "Makeup",
        image: "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=900&q=90",
        stock: 19
    },

    {
        name: "Soft Glow Highlighter",
        description: "A finely milled highlighter that creates a subtle luminous finish.",
        price: 999,
        category: "Makeup",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=90",
        stock: 24
    },

    {
        name: "Hydrating Lip Gloss",
        description: "A comfortable high-shine gloss designed for a soft polished finish.",
        price: 699,
        category: "Makeup",
        image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=900&q=90",
        stock: 30
    },


    // =====================================================
    // SHOES — 6 PRODUCTS
    // =====================================================

    {
        name: "Urban Leather Sneakers",
        description: "Minimal leather sneakers designed for comfortable everyday movement.",
        price: 2799,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=90",
        stock: 16
    },

    {
        name: "Minimal White Sneakers",
        description: "Clean-lined sneakers with a timeless silhouette and versatile everyday styling.",
        price: 2499,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=90",
        stock: 21
    },

    {
        name: "Classic Leather Loafers",
        description: "Polished leather loafers designed for a refined and effortless wardrobe.",
        price: 2999,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=90",
        stock: 12
    },

    {
        name: "Retro Street Sneakers",
        description: "A contemporary retro-inspired sneaker with a comfortable everyday profile.",
        price: 2599,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=90",
        stock: 18
    },

    {
        name: "Premium Beige Sneakers",
        description: "Neutral-toned sneakers with a clean profile and understated finish.",
        price: 2899,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=90",
        stock: 15
    },

    {
        name: "Everyday Platform Shoes",
        description: "A modern platform silhouette balancing comfort with contemporary styling.",
        price: 3199,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=90",
        stock: 13
    },


    // =====================================================
    // HEELS — 6 PRODUCTS
    // =====================================================

    {
        name: "Sculpted Black Heels",
        description: "Elegant black heels featuring a sculpted silhouette for evening occasions.",
        price: 2899,
        category: "Heels",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=90",
        stock: 15
    },

    {
        name: "Satin Evening Heels",
        description: "Refined satin heels created to add an elegant finishing touch to evening looks.",
        price: 3199,
        category: "Heels",
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=90",
        stock: 10
    },

    {
        name: "Nude Slingback Heels",
        description: "A timeless slingback silhouette with a sophisticated neutral finish.",
        price: 2699,
        category: "Heels",
        image: "https://images.unsplash.com/photo-1595950653106-6c2e13f0c7c7?auto=format&fit=crop&w=900&q=90",
        stock: 13
    },

    {
        name: "Pointed Ivory Heels",
        description: "Elegant pointed heels in a soft ivory tone for polished occasions.",
        price: 2999,
        category: "Heels",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=90",
        stock: 11
    },

    {
        name: "Strappy Evening Heels",
        description: "Delicate strappy heels designed to complement sophisticated evening looks.",
        price: 3399,
        category: "Heels",
        image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=900&q=90",
        stock: 9
    },

    {
        name: "Classic Beige Pumps",
        description: "A timeless pump silhouette designed for elegant everyday dressing.",
        price: 2799,
        category: "Heels",
        image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=90",
        stock: 17
    }

];


async function seedProducts() {

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "Connected to MongoDB successfully!"
        );


        // Clear existing products
        await Product.deleteMany({});

        console.log(
            "Existing products cleared."
        );


        // Insert all products
        const createdProducts =
            await Product.insertMany(products);


        console.log("");
        console.log(
            `${createdProducts.length} products added successfully!`
        );
        console.log("");

        console.log(
            "ShopEase product collection is ready."
        );


        await mongoose.connection.close();

        console.log(
            "MongoDB connection closed."
        );


    } catch (error) {

        console.error(
            "Product seeding failed:"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}


seedProducts();