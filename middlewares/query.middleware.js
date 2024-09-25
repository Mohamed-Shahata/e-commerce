export const attachFindQuery = (model) => {
  return (req, res, next) => {
    try {
      req.dbQuery = model.find({});
console.log(req.dbQuery,"fffffffffffff");

      next();
    } catch (err) {
      console.error("Error finding document:", err);
      return res.status(500).json({ message: "Error finding document" });

    }
  };
};

export const attachAddQuery = (model) => {
  return (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID missing in request" });
    }
    req.body.createdBy = req.user.id;
    console.log("req.body.createdBy", req.body.createdBy);

    // req.dbQuery = model.create(req.body);
    // console.log("ss", req.dbQuery);
    try {
      req.dbQuery = model.create(req.body);
      console.log("ss", req.dbQuery); // Will now show the resolved data
      next();
    } catch (err) {
      console.error("Error creating document:", err);
      return res.status(500).json({ message: "Error creating document" });
    }
  };
};

export const attachUpdateQuery = (model) => {
  return (req, res, next) => {
    req.dbQuery = model.updateMany({}, req.body);
    next();
  };
};
export const attachDeleteQuery = (model) => {
  return (req, res, next) => {
    req.dbQuery = model.deleteMany({});
    next();
  };
};
