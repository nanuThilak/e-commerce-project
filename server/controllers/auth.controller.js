import UserModel from "../models/User.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};



const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = await UserModel.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user._id);
    setCookies(res, accessToken, refreshToken);
    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Account created successfull",
    });
  } catch (error) {
    console.log(`error in signup controller ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      setCookies(res, accessToken, refreshToken);
      return res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "Account login successfull",
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(`error in signin controller ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const refresh_token = req.cookies.refreshToken;

    if (refresh_token) {
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET
      );
      
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logout successfully" });
  } catch (error) {
    console.log(`error in logout controller ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) {
      return res.status(401).json({ error: "No refresh token provided" });
    }
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    if (storeToken !== refresh_token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    return res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log(`error in refreshToken controller ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getProfile = (req, res) => {
  try {
    return res.json(req.user)
  }
  catch(error) {
    console.log('error in getProfile controller ', error)
    return res.status(500).json({error: 'internal server error'})
  }

}


export { signup, signin, logout, refreshToken, getProfile };
