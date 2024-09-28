const clothesCategory = async (obj) => {
  try {
    if (obj.size === null) {
      return Error().message("required");
    }
  } catch (error) {
    console.log("Error Clothes");
  }
};

export {
  clothesCategory,
};
