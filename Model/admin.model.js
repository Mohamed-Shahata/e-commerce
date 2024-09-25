import { Schema } from "mongoose";
import { User } from "./User.js";

export const adminSchema = Schema({
  permissions: Array,
  assignedTasks: Array,
  department: String,
});

const Admin = User.discriminator("admin", adminSchema);
export { Admin };
