import ProductModel from "../models/Product.model.js";
export const getCartProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({
      _id: { $in: req.user.cartItems },
    });
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItems) => cartItems.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    return res.json(cartItems);
  } catch (error) {
    console.log(`Error in getCartProducts controller `, error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    return res.json(user.cartItems);
  } catch (error) {
    console.log(`Error in addToCart controller `, error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    return res.json(user.cartItems);
  } catch (error) {
    console.log(`Error in removeAllFromCart controller `, error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      return res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(`Error in updateQuantity `, error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
