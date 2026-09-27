const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

async function fixHeels() {

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "Connected to MongoDB successfully!"
        );


        const updates = [

            {
                name: "Sculpted Black Heels",

                image:
                    "https://images.unsplash.com/photo-1596702876489-9d11e5806161?auto=format&fit=crop&w=900&q=90"
            },


            {
                name: "Satin Evening Heels",

                image:
                    "https://images.unsplash.com/photo-1770757685173-94df47a52b68?auto=format&fit=crop&w=900&q=90"
            },


            {
                name: "Nude Slingback Heels",

                image:
                    "https://images.unsplash.com/photo-1446746423095-7ac8dde4962b?auto=format&fit=crop&w=900&q=90"
            },


            {
                name: "Pointed Ivory Heels",

                image:
                    "https://images.unsplash.com/photo-1562687848-c1664eff566d?auto=format&fit=crop&w=900&q=90"
            },


            {
                name: "Strappy Evening Heels",

                image:
                    "https://images.unsplash.com/photo-1503758425033-cd7b21496e21?auto=format&fit=crop&w=900&q=90"
            },


            {
                name: "Classic Beige Pumps",

                image:
                    "https://images.unsplash.com/photo-1559334417-1adb87b6e97f?auto=format&fit=crop&w=900&q=90"
            }

        ];


        for (const product of updates) {

            const result =
                await Product.updateOne(
                    {
                        name: product.name,
                        category: "Heels"
                    },
                    {
                        $set: {
                            image: product.image
                        }
                    }
                );


            if (result.matchedCount > 0) {

                console.log(
                    `✓ Updated: ${product.name}`
                );

            } else {

                console.log(
                    `⚠ Product not found: ${product.name}`
                );

            }

        }


        console.log("");
        console.log(
            "✓ All heels images have been updated."
        );
        console.log(
            "✓ No other products were changed."
        );


        await mongoose.connection.close();

        console.log(
            "MongoDB connection closed."
        );


    } catch (error) {

        console.error(
            "Failed to update heels:"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}


fixHeels();