const express = require("express"); //! Libary for at lave en server
const app = express(); //! Initialiserer express

app.use(express.json()); //! middleware til at parse JSON body

//! Dummy data
let products = [
  { id: 1, navn: "Product A", pris: 100 },
  { id: 2, navn: "Product B", pris: 200 },
];

//! Endpoints for produkter
app.get("/products", (req, res) => {
  res.json(products);
});

//! Get product by ID
app.post("/products", (req, res) => {
  const newProduct = req.body; //? Get data from request body
  newProduct.id = products.length + 1; //? Add auto-increment ID
  products.push(newProduct); //? Add new product to array
  res.status(201).json(newProduct); //? Send back the created product
});

//! Start server
app.listen(3000, () => {
  console.log("Serveren kører på http://localhost:3000");
});
