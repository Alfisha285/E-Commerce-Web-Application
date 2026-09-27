const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// ==========================================
// GET ALL PRODUCTS
// GET /api/products
// ==========================================

router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({
            createdAt: -1
        });

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products."
        });
    }
});

// ==========================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product."
        });
    }
});

// ==========================================
// CREATE PRODUCT
// POST /api/products
// ADMIN ONLY
// ==========================================

router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            typeof category !== "string" ||
            !category.trim()
        ) {
            return res.status(400).json({
                message: "Name, description, and category are required."
            });
        }

        if (
            price === undefined ||
            typeof price !== "number" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            return res.status(400).json({
                message: "Price must be a valid non-negative number."
            });
        }

        if (
            stock !== undefined &&
            (!Number.isInteger(stock) || stock < 0)
        ) {
            return res.status(400).json({
                message: "Stock must be a non-negative whole number."
            });
        }

        if (image !== undefined && typeof image !== "string") {
            return res.status(400).json({
                message: "Image must be a string."
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price,
            category: category.trim(),
            image: image || "",
            stock: stock === undefined ? 0 : stock
        });

        res.status(201).json({
            message: "Product created successfully!",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create product."
        });
    }
});

// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ADMIN ONLY
// ==========================================

router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const allowedFields = [
            "name",
            "description",
            "price",
            "category",
            "image",
            "stock"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid product fields provided."
            });
        }

        if (
            updates.name !== undefined &&
            (typeof updates.name !== "string" || !updates.name.trim())
        ) {
            return res.status(400).json({
                message: "Product name must not be empty."
            });
        }

        if (
            updates.description !== undefined &&
            (typeof updates.description !== "string" ||
                !updates.description.trim())
        ) {
            return res.status(400).json({
                message: "Description must not be empty."
            });
        }

        if (
            updates.category !== undefined &&
            (typeof updates.category !== "string" ||
                !updates.category.trim())
        ) {
            return res.status(400).json({
                message: "Category must not be empty."
            });
        }

        if (
            updates.price !== undefined &&
            (typeof updates.price !== "number" ||
                !Number.isFinite(updates.price) ||
                updates.price < 0)
        ) {
            return res.status(400).json({
                message: "Price must be a valid non-negative number."
            });
        }

        if (
            updates.stock !== undefined &&
            (!Number.isInteger(updates.stock) || updates.stock < 0)
        ) {
            return res.status(400).json({
                message: "Stock must be a non-negative whole number."
            });
        }

        if (
            updates.image !== undefined &&
            typeof updates.image !== "string"
        ) {
            return res.status(400).json({
                message: "Image must be a string."
            });
        }

        if (updates.name !== undefined) {
            updates.name = updates.name.trim();
        }

        if (updates.description !== undefined) {
            updates.description = updates.description.trim();
        }

        if (updates.category !== undefined) {
            updates.category = updates.category.trim();
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product updated successfully!",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product."
        });
    }
});

// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ADMIN ONLY
// ==========================================

router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product."
        });
    }
});

module.exports = router;