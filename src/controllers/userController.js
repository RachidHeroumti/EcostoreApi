
import dotenv from "dotenv";
import generateToken from "../config/generateToken.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import VerificationTemplate from "../templates/verficationTemplate.js";
import logger from "../tools/logger.js";
import User from "../models/User.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.EMAIL_PWD,
  },
});

export const getTokenEmailVerification = async (req, res) => {
  const { token } = req.params;
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SCRT);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (user.isActive) {
      return res.status(400).json({ message: "User is already verified" });
    }

    user.isActive = true;
    await user.save();
    res
      .status(200)
      .send(
        '<h2 style="color: #28a745; text-align: center;">Email successfully verified</h2>'
      );
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const Register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "Empty fields" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  // if (!validatePassword(password)) {
  //   return res.status(400).json({
  //     message:
  //       "Password must be at least 6 characters long and contain both letters and numbers",
  //   });
  // }
  try {
    let user = await User.findOne({ email });
    if (user) return res.json({ message: "user already Exist !" });
    else {
      user = new User({ firstname, lastname, email, password });
      user.save();

      
      const token = generateToken(user._id, 1);
      const verificationUrl = `http://localhost:5000/api/users/verify-email/${token}`;

      const mailOptions = {
        from: process.env.User_Email,
        to: user.email,
        subject: "Email Verification",
        html: VerificationTemplate(verificationUrl),
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.json({ message: "Empty fields" });
  else {
    try {
      let user = await User.findOne({ email });
      if (!user) return res.json({ message: "email or password incorrect !" });
      else {
        if (!(await user.matchPassword(password)))
          return res.json({ message: "email or password incorrect !" });
      }
      res.status(200).json({
        id: user._id,
        firstname: user.firstname,
        lastname :user.lastname,
        email: user.email,
        role: user.role,
        image : user.image,
        token: generateToken(user._id),
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'ceo' } });
    res.status(200).json({ users });
  } catch (error) {
    logger.error("🚀 ~ getUsers ~ error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

;
export const getUser = async(req,res)=>{
  const {id} = req.params ;

  try{
    const user = await User.findById(id) ;
    if(!user )return res.status(404).json({message : 'user not found'})
    res.status(200).json({
      id: user._id,
      firstname: user.firstname,
      lastname :user.lastname,
      email: user.email,
      role: user.role,
      image : user.image
    });
  }catch(err){
  console.log("🚀 ~ getUser ~ err:", err)

  }
}
export const updateUserRoleByCeo = async (req, res) => {
  const { id } = req.params;
  console.log("🚀 ~ updateUserRoleByCeo ~ id:", id)
  const { role } = req.body;
  try {
    let userToUpdate = User.findOne({ _id: id });
    if (!userToUpdate)
      return res.status(200).json({ message: "user not found" });
    userToUpdate = await User.findByIdAndUpdate(id, { role: role });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateUserByCeo = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, role, password } = req.body;

  try {
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) return res.status(404).json({ message: "User not found" });

    const payload = { firstname, lastname, email, role, ...(password && { password }) };
    const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  const id = req.params.id;
  console.log("🚀 ~ deleteUser ~ id:", id)
  try {
    const deletedUser =await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Deleted successfully", deletedUser });
  } catch (error) {
    console.log("🚀 ~ deleteUser ~ error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};
