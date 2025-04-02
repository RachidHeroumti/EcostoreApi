import Shipping from "../models/Shipping.js";


export const createShipping = async (req, res) => {
  const { name, ApiKey, Idkey, isdefault } = req.body;


  if (!name || !ApiKey || !Idkey) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All fields (name, ApiKey, Idkey) are required.",
      });
  }

  try {
    const addedCompany = new Shipping({ name, ApiKey, Idkey, isdefault });
    await addedCompany.save();
    res.status(201).json({ success: true, shipping: addedCompany });
  } catch (error) {
    console.error("🚀 ~ createShipping ~ error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllShipping = async (req, res) => {
  try {
    const shippings = await Shipping.find();
    res.status(200).json({ success: true, shippings });
  } catch (error) {
    console.error("🚀 ~ getAllShipping ~ error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getShippingById = async (req, res) => {
  try {
    const shipping = await Shipping.findById(req.params.id);
    if (!shipping) {
      return res
        .status(404)
        .json({ success: false, message: "Shipping not found" });
    }
    res.status(200).json({ success: true, shipping });
  } catch (error) {
    console.error("🚀 ~ getShippingById ~ error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateShipping = async (req, res) => {
  const { ApiKey, Idkey } = req.body;
  if (!ApiKey || !Idkey) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All fields ( ApiKey, Idkey) are required.",
      });
  }

  try {
    const updatedShipping = await Shipping.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedShipping) {
      return res
        .status(404)
        .json({ success: false, message: "Shipping not found" });
    }
    res.status(200).json({ success: true, shipping: updatedShipping });
  } catch (error) {
    console.error("🚀 ~ updateShipping ~ error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteShipping = async (req, res) => {
  try {
    const deletedShipping = await Shipping.findByIdAndDelete(req.params.id);
    if (!deletedShipping) {
      return res
        .status(404)
        .json({ success: false, message: "Shipping not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Shipping deleted successfully" });
  } catch (error) {
    console.error("🚀 ~ deleteShipping ~ error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const setDefaultShipping = async (req, res) => {
    const { id } = req.params;
    try {
        const shipping = await Shipping.findById(id);
        if (!shipping) {
            return res.status(404).json({ success: false, message: "Shipping not found" });
        }

        await Shipping.updateMany({}, { isdefault: false });

        shipping.isdefault = true;
        await shipping.save();

        res.status(200).json({ success: true, message: "Default shipping updated", shipping });
    } catch (error) {
        console.error("🚀 ~ setDefaultShipping ~ error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
