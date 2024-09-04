const handleObject = (inputObject) => {
  const result = {};

  for (const key in inputObject) {
      if (inputObject[key] === "" || inputObject[key] === undefined) {
          result[key] = null;
      } else {
          result[key] = inputObject[key];
      }
  }

  return result;
}

module.exports = {handleObject};