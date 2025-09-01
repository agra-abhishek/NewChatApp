import User from '../models/userModel.js'; // use default export
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    // Validation
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check existing user
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists, try different" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Profile photo
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Save user
    const newUser = await User.create({
      fullName,
      username,
      password: hashedPassword,
      profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
      gender
    });

    // Success response
    res.status(201).json({
      message: "User registered successfully",
      
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



//Login 

export const login = async(req,res)=>{
    try{
    const {username , password} = req.body;
    // Validation
    if ( !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
      };
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Username do not exist" , success:false });
      };
      const isPasswordMatch = await bcrypt.compare(password , user.password);
      if(!isPasswordMatch){
        return res.status(400).json({ message: "password or username is wrong" , success:false });
      };
    
 // Success response

  //Json Web Token 
   const tokenData = {
    userId:user._id
   };
   const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
   return res.status(200).cookie("token", token , { maxAge:1*24*60*60*1000 ,httpOnly:true, sameSite:"strict"}).json(
    {   message: "✅ Login Successful",
     user :{ _id:user._id,
     username:user.username,
     fullName:user.fullName,
     profilePhoto:user.profilePhoto,
     }
   });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }

