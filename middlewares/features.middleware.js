export const filterOne = ({ fieldName, paramName }) => {
  return (req, res, next) => {
    req.dbQuery = req.dbQuery.where({ [fieldName]: req.params[paramName] }); //.populate()
    next();
  };
};

export const paginateQuery = ({ pageLimit = 5 }) => {
  return (req, res, next) => {
    try {
      let { page } = req.query || 1;
      if (page < 1) {
        page = 1;
      }
      req.dbQuery = req.dbQuery.skip((page - 1) * pageLimit).limit(pageLimit);
      console.log("req.dbQuery11", req.dbQuery);

      next();
    } catch (err) {
      // Handle potential errors from dbQuery
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Error executing query" });
    }
  };
};

export const populateQuery = (fieldName) => {
  return (req, res, next) => {
    req.dbQuery = req.dbQuery.populate(fieldName);
    next();
  };
};

export const sortQuery = () => {
  return (req, res, next) => {
    try {
      let { sort, dir = "asc" } = req.query;
      if (!sort) return next();
      req.dbQuery = req.dbQuery.sort({ [sort]: dir });
      next();
    } catch (err) {
      // Handle potential errors from dbQuery
      console.error("Error sort query:", err);
      return res.status(500).json({ message: "Error sort query" });
    }
  };
};

export const fieldsQuery = () => {
  return (req, res, next) => {
    try {
      const { fields } = req.query;
      if (!fields) return next();
      req.dbQuery = req.dbQuery.select(fields.split(","));
      next();
    } catch (err) {
      // Handle potential errors from dbQuery
      console.error("Error field query:", err);
      return res.status(500).json({ message: "Error field query" });
    }
  };
};

export const searchQuery = (fields) => {
  return (req, res, next) => {
    try {
      const { keyWord } = req.query;
      if (!keyWord) return next();

      // Constructing the regex query
      const regexQuery = {
        $or: fields.map((fieldName) => ({
          [fieldName]: new RegExp(keyWord, "i"), // 'i' for case-insensitive search
        })),
      };
      console.log("regexQuery",regexQuery);
      
      // Combining with existing query
      req.dbQuery = req.dbQuery.find(regexQuery);
      next();
    } catch (err) {
      // Handle potential errors from dbQuery
      console.error("Error search query:", err);
      return res.status(500).json({ message: "Error search query" });
    }
  };
};

export const filterQuery = () => (req, res, next) => {
  try {
    const filterFields = { ...req.query };
    console.log(filterFields, "Original Filter Fields");

    const exclusionList = ["page", "sort", "keyword", "fields", "dir"];

    exclusionList.forEach((item) => {
      delete filterFields[item];
    });

    const filterFieldsString = JSON.stringify(filterFields);
    const modifiedFilterFieldsString = filterFieldsString.replace(
      /(lt|lte|gt|gte)/g,
      (match) => `$${match}`
    );

    const modifiedFilterFields = JSON.parse(modifiedFilterFieldsString);
    console.log("Modified Filter Fields:", modifiedFilterFields);

    // Ensure req.dbQuery is defined before modifying it
    if (!req.dbQuery) {
      console.error("req.dbQuery is not defined.");
      return res.status(500).json({ message: "Query not initialized." });
    }

    req.dbQuery = req.dbQuery.where(modifiedFilterFields);
    console.log("Updated req.dbQuery:", req.dbQuery);

    next();
  } catch (err) {
    // Handle potential errors from dbQuery
    console.error("Error modifiedFilterFields query:", err);
    return res
      .status(500)
      .json({ message: "Error modifiedFilterFields query" });
  }
};
