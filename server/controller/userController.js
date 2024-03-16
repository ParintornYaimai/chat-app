const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const emailExist = await User.findOne({ email: email });
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Incomplete information filled in" });
    } else if (emailExist) {
      return res.status(400).json({ message: "Email not available" });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        username,
        email,
        password: hashPassword,
      });
      res.status(200).json({ message: "created" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email: email });
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Incomplete information filled in" });
    } else if (!userExist) {
      return res
        .status(400)
        .json({ message: "This email address does not exist in the system" });
    } else {
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const token = JWT.sign(
        { _id: userExist.id, email: userExist.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res
        .status(200)
        .json({
          _id: userExist.id,
          username: userExist.username,
          email: userExist.email,
          token,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findUser = async(req, res) => {
  const userId = req.params.userId
  try {
    const user = await User.findOne({_id:userId}).select('-password')
    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error")
  }
};

exports.getAllUser=async(req,res)=>{
    try{
        const user = await User.find().select('-password')
        res.status(200).json(user)
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error'})
    }
}