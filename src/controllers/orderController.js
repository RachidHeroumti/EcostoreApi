import Order from "../models/Order.js";
import twilio from "twilio";
import webpush from "web-push";
import Subscribe from "../models/Subscribe.js";

const accountSid = "ACad97e151c8e9208bb3a4aebb74a01a76";
const authToken = "8d52c491100d2faba74d50c4f4623610";
const client = new twilio(accountSid, authToken);

const sendOrderNotification = async (orderId) => {
  try {
    const myPhoneNumber = "212616421373";

    const message = await client.messages.create({
      body: `New Order Received! Order ID: #${orderId}.`,
      from: "+212631675361",
      to: myPhoneNumber,
    });
    console.log(`🚀 SMS sent to you: ${message.sid}`);
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
  }
};

export const AddOrder = async (req, res) => {
  const {
    fullname,
    email,
    phon,
    address,
    city,
    country,
    products,
    total,
    offer,
  } = req.body;
  console.log("🚀 ~ AddOrder ~ req.body:", req.body)

  if (
    !fullname ||
    !address ||
    !phon ||
    !city ||
    !products?.length > 0 ||
    !total
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const orderAdded = new Order({
      fullname,
      email,
      address,
      city,
      phon,
      country,
      products,
      total,
      offer,
    });
    await orderAdded.save();
    const sellerSubscriptions = await Subscribe.find();

    if (!sellerSubscriptions.length) {
      return res
        .status(404)
        .json({ message: "No sellers subscribed to notifications" });
    }

    const payload = JSON.stringify({
      title: "New Order Received!",
      body: `${fullname} has new order with total $${total}.`,
      icon: "/logo.png",
    });
    
    console.log("🚀 ~ AddOrder ~ payload:", payload)

    const notificationPromises = sellerSubscriptions.map((sub) =>
       webpush
        .sendNotification(sub, payload)
        .catch((err) => console.error("Push error:", err))
    );
    
    await Promise.all(notificationPromises);
    res
      .status(201)
      .json({ message: "Order added successfully!", order: orderAdded });
  } catch (err) {
    console.error("🚀 ~ AddOrder ~ error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrders = async (req, res) => {
  let { limit = 50, page = 1, ...query } = req.query;

  limit = parseInt(limit);
  page = parseInt(page);

  if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
    return res.status(400).json({ message: "Invalid pagination parameters." });
  }
  try {
    const orders = await Order.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("🚀 ~ getOrders ~ error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Updated successfully", updatedOrder });
  } catch (error) {
    console.error("🚀 ~ updateOrder ~ error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Deleted successfully", deletedOrder });
  } catch (error) {
    console.error("🚀 ~ deleteOrder ~ error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrderCount = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.status(200).json({ totalOrders: count });
  } catch (error) {
    console.error("Error fetching order count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
