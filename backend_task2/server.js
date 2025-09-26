const express = require("express"); //! Libary for at lave en server
const cors = require("cors"); //? Import the CORS middleware + npm i cors

const app = express();

app.use(express.json()); //! Middleware to parse JSON bodies
app.use(cors()); //! Enable CORS for all routes

let products = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 200 },
  { id: 3, name: "Product J", price: 300 },
];

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
