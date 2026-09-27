const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const { protect } = require("../middleware/auth");

const router = express.Router();


// ======================================
// CREATE NEW ORDER
// ======================================

router.post("/", protect, async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod
        } = req.body;


        // ------------------------------
        // Validate items
        // ------------------------------

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Your order must contain at least one product."
            });
        }


        // ------------------------------
        // Validate payment method
        // ------------------------------

        if (!["cash_on_delivery", "online"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method."
            });
        }


        // ------------------------------
        // Validate shipping address
        // ------------------------------

        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.email ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.postalCode
        ) {
            return res.status(400).json({
                message: "Please provide complete shipping information."
            });
        }


        // ------------------------------
        // Prepare order items
        // ------------------------------

        const orderItems = [];
        let totalAmount = 0;

        // Keep track of products whose stock
        // has been reduced in case we need
        // to restore it if something fails.
        const stockChanges = [];


        try {

            for (const item of items) {

                if (!mongoose.Types.ObjectId.isValid(item.product)) {
                    throw new Error("Invalid product ID.");
                }

                const quantity = Number(item.quantity);

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1
                ) {
                    throw new Error(
                        "Product quantity must be at least 1."
                    );
                }


                // Find the real product in MongoDB.
                const product = await Product.findById(
                    item.product
                );


                if (!product) {
                    throw new Error(
                        "One of the selected products no longer exists."
                    );
                }


                // Atomically reduce stock only if
                // enough stock is available.
                const updatedProduct =
                    await Product.findOneAndUpdate(
                        {
                            _id: product._id,
                            stock: { $gte: quantity }
                        },
                        {
                            $inc: {
                                stock: -quantity
                            }
                        },
                        {
                            new: true
                        }
                    );


                if (!updatedProduct) {
                    throw new Error(
                        `${product.name} does not have enough stock available.`
                    );
                }


                // Store the change so it can be
                // restored if order creation fails.
                stockChanges.push({
                    productId: product._id,
                    quantity
                });


                // IMPORTANT:
                // Use the price from the database,
                // NOT the price sent by the browser.
                const itemPrice = Number(product.price);

                orderItems.push({
                    product: product._id,
                    quantity,
                    price: itemPrice
                });


                totalAmount += itemPrice * quantity;
            }


            // ------------------------------
            // Create the order
            // ------------------------------

            const order = await Order.create({
                user: req.user._id,

                items: orderItems,

                shippingAddress: {
                    fullName:
                        shippingAddress.fullName.trim(),

                    email:
                        shippingAddress.email.trim().toLowerCase(),

                    phone:
                        shippingAddress.phone.trim(),

                    address:
                        shippingAddress.address.trim(),

                    city:
                        shippingAddress.city.trim(),

                    postalCode:
                        shippingAddress.postalCode.trim()
                },

                paymentMethod,

                paymentStatus:
                    paymentMethod === "online"
                        ? "pending"
                        : "pending",

                orderStatus: "pending",

                totalAmount
            });


            return res.status(201).json({
                message: "Order placed successfully!",
                order: {
                    id: order._id,
                    totalAmount: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    orderStatus: order.orderStatus,
                    createdAt: order.createdAt
                }
            });


        } catch (error) {

            // ------------------------------
            // Restore stock if something failed
            // ------------------------------

            for (const change of stockChanges) {

                await Product.findByIdAndUpdate(
                    change.productId,
                    {
                        $inc: {
                            stock: change.quantity
                        }
                    }
                );
            }

            throw error;
        }


    } catch (error) {

        console.error(
            "Create order error:",
            error.message
        );

        return res.status(400).json({
            message: error.message ||
                "Unable to create order."
        });
    }
});


// ======================================
// GET CURRENT USER'S ORDERS
// ======================================

router.get("/", protect, async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user._id
        })
            .populate(
                "items.product",
                "name image"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json(orders);

    } catch (error) {

        console.error(
            "Get orders error:",
            error.message
        );

        return res.status(500).json({
            message: "Unable to retrieve your orders."
        });
    }
});


// ======================================
// GET ONE USER ORDER
// ======================================

router.get("/:id", protect, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID."
            });
        }


        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate(
            "items.product",
            "name image"
        );


        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }


        return res.status(200).json(order);

    } catch (error) {

        console.error(
            "Get order error:",
            error.message
        );

        return res.status(500).json({
            message: "Unable to retrieve the order."
        });
    }
});


module.exports = router;