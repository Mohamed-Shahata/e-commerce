import { User } from "../Model/User.js";
import { schedule } from "node-cron";

/**
 * @description Delete Users In Active
 * @access      private
 */
const deleteInActiveUsers = async() => {
  const tenDayAgo = Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const result = await User.deleteMany({
      registed: false,
      createdAt: {
        $lte: tenDayAgo
      }
    });
    console.log(`deleted done: ${result.deletedCount}`)
  } catch (error) {
    console.log("error deleteInActiveUsers: " + error)
  }
};

schedule("0 0 * * *" , () => {
  console.log("deleted users inactvation");
  deleteInActiveUsers();
});