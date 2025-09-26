const express = require("express"); //! Libary for at lave en server
const app = express(); //! Initialiserer express

app.use(express.json()); //! middleware til at parse JSON body

//! Dummy data
let db = require("./data.json"); //? Import data from data.json
let products = db.products; //? Extract products array

// //! Endpoints for produkter
// app.get("/products", (req, res) => {
//   res.json(products);
// });

//! Get product by ID
app.post("/products", (req, res) => {
  const newProduct = req.body; //? Get data from request body
  newProduct.id = products.length + 1; //? Add auto-increment ID
  products.push(newProduct); //? Add new product to array
  res.status(201).json(newProduct); //? Send back the created product
  console.log(req.body);
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

  const deletedProduct = products.splice(productIndex, 1); //! DELETE the products from the array use the method splice to remove the product at the found index

  //! status 200 means OK
  res.status(200).json({
    message: `Product with ID ${productId} deleted successfully.`,
    deletedProduct: deletedProduct[0], //! Return the deleted product
  });
});

app.get("/products", (req, res) => {
  const query = req.query; //! Extract query parameters from the URL string (productss?name=ProductA)

  if (Object.keys(query).length === 0) {
    return res.json(products); //! If no query parameters, return all products
  }

  //! Filter products based on query parameters
  const filteredProducts = products.filter((product) => {
    //! cycle for each key in the query parameters
    for (let key in query) {
      //! If the product does not have the key or the value does not match, return false
      if (
        !product[key] ||
        product[key].toString().toLowerCase() !== query[key].toLowerCase()
      ) {
        return false; //! return false if any key does not match
      }
    }
    return true; //! return true if all keys match
  });

  res.json(filteredProducts); //! Return the filtered products
});

//! Start server
app.listen(3000, () => {
  console.log("Serveren kører på http://localhost:3000 (simpelt Express API)");
});
