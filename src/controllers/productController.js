import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    category = [],
    images = [],
    brands = [],
    offers = [],
    publish = true,
    details
  } = req.body;
  const user = req.user;
  try {
    if (!title || !description || !price || images.length === 0) {
      return res.status(400).json({ message: "Some fields are empty" });
    }
    const createdProduct = new Product({
      title,
      description,
      price,
      category,
      images,
      brands,
      offers,
      publish,
      creator: user._id,
      details
    });

    await createdProduct.save();

    res.status(201).json(createdProduct);
  } catch (err) {
    console.error("🚀 ~ createProduct ~ Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getProducts = async (req, res) => {
    try {
      let { page = 1, limit = 20, ...query } = req.query; 
      page = parseInt(page);
      limit = parseInt(limit);
      const skip = (page - 1) * limit;
      const products = await Product.find(query).limit(limit).skip(skip);
      const totalProducts = await Product.countDocuments(query);
  
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }

      return res.status(200).json({
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        products,
      });
    } catch (error) {
      console.error("🚀 ~ getProducts ~ error:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.deleteOne({ _id: id });

    if (deletedProduct.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Deleted successfully!" });
  } catch (error) {
    console.error("🚀 ~ deleteProduct ~ error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("🚀 ~ updateProduct ~ error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


export const getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ totalProducts: count });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({ message: "Server error" });
  }
};
