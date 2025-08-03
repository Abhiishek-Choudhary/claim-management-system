import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  await User.findByIdAndUpdate(id, { role });
  res.json({ message: "Role updated" });
};
