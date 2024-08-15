const { User } = require("../Model/User.js");
const cron = require("node-cron");

/**
 * @description Delete Users In Active
 * @access      private
 */
const deleteInActiveUsers = async() => {
  const tenDayAgo = Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
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

cron.schedule("0 0 * * *" , () => {
  console.log("deleted users inactvation");
  deleteInActiveUsers();
});