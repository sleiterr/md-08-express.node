const express = require("express"); //! Libary for at lave en server
const cors = require("cors"); //? Import the CORS middleware + npm i cors

const app = express();

app.use(express.json()); //! Middleware to parse JSON bodies
app.use(cors()); //! Enable CORS for all routes

let db = require("./data.json"); //! Import data from data.json
let products = db.products; //! Extract products array

//! Get product by ID use async function for better error handling
app.get("/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id); //! Get ID from URL parameter and convert string to number use the parseInt function
    const product = products.find((p) => p.id === productId); //! use method find to search for the product with the given ID

    //! If product not found, return 404
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    //! If product found, return it with 202 status
    res.status(202).json({
      success: true,
      product,
    });
    //! method catch to handle any unexpected errors
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

//! POST endpoint to add multiple products at once
app.post("/products/bulk", (req, res) => {
  const newProducts = req.body; //! Get array of new products from request body

  //! Validate: request body must be a non-empty array, otherwise return error
  if (!Array.isArray(newProducts) || newProducts.length === 0) {
    return res.status(400).json({ error: "An array of products is required" });
  }

  //! Validate: each product must have a name and price, otherwise return error
  const invalidProducts = newProducts.find((p) => !p.name || !p.price);
  if (invalidProducts) {
    return res
      .status(400) //? Bad Request
      .json({ error: "Each product must have a name and price" }); //? Exit the function if validation fails
  }

  //! map over new products to assign IDs and prepare them for insertion
  const addedProducts = newProducts.map((p, index) => ({
    id: products.length + index + 1, //? Assign a new ID
    name: p.name,
    price: p.price,
  }));
  products.push(...addedProducts); //? Add all new products to the array

  res.status(201).json(addedProducts); //? Send back the created products
});

//!GET endpoint to fetch products
app.get("/products", (req, res) => {
  res.json(products); //! Sender products som JSON
});

//!GET endpoint for the root route
app.get("/", (req, res) => {
  res.send("Velkommen til produkt-API'en!"); //! message when accessing the root route
});

//!POST endpoint to add a new product
app.post("/products", (req, res) => {
  const newProduct = req.body; //! Henter det nye produkt fra request body

  if (!newProduct.name || !newProduct.price) {
    //! Check if name and price are provided if not send error
    return res.status(400).json({ error: "Name and price are required" });
  }

  newProduct.id = products.length + 1; //! Assign a new ID
  products.push(newProduct); //! Add the new product to the array
  res.status(201).json(newProduct); //! Send back the created product with 201 status
});

//! DELETE product by ID
app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id); //! Get ID from URL parameter parseInt to convert string to number
  const productIndex = products.findIndex((p) => p.id === productId); //! Search for the index of the product with the given ID

  //! If statment to check if product exists if not exit function and return 404
  if (productIndex === -1) {
    return res
      .status(404)
      .json({ message: `Product with ID ${productId} not found` });
  }

  const deletedProduct = products.splice(productIndex, 1)[0]; //! DELETE the products from the array use the method splice to remove the product at the found index

  //! status 200 means OK
  res.status(200).json({
    message: `Product with ID ${productId} deleted successfully.`,
    deletedProduct: deletedProduct, //! Return the deleted product
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
