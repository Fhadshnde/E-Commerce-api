const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE CART OR ADD PRODUCT TO CART
router.post("/", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Check if the cart exists
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // If the cart exists, add the product to it
      const productIndex = cart.products.findIndex(
        (product) => product.productId === productId
      );

      if (productIndex > -1) {
        // If the product already exists in the cart, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // If the product is new, add it to the cart
        cart.products.push({ productId, quantity });
      }
    } else {
      // If the cart doesn't exist, create a new cart
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    }

    const savedCart = await cart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE CART
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE CART
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL CARTS
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
