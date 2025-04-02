import Section from "../models/Section.js";

// Create a new section
export const CreateSection = async (req, res) => {
  const { title, description, images, type, products, total } = req.body;
  const user = req.user;
  let newSection = {};
  try {
    newSection = new Section({
      title,
      description,
      images,
      type,
      creator: user,
      products,
      total,
    });
    await newSection.save();
    res
      .status(201)
      .json({ message: "Section added successfully!", section: newSection });
  } catch (err) {
    console.error("🚀 ~ CreateSection ~ error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSections = async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    const sections = await Section.find(query).sort({ createdAt: -1 });
    res.status(200).json(sections);
  } catch (err) {
    console.error("🚀 ~ getSections ~ error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSection = async (req, res) => {
  const { id } = req.params;
  try {
    const section = await Section.findById(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    await Section.findByIdAndDelete(id);
    res.status(200).json({ message: "Section deleted successfully!" });
  } catch (err) {
    console.error("🚀 ~ deleteSection ~ error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
