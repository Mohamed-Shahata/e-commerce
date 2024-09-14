import { catchAsyncError } from "../utils/error.handler.js";

export const executeQuery = ({ status = 200 } = {}) => {
  return catchAsyncError(async (req, res, next) => {
    const response = await req.dbQuery;
    res.status(status).json({ response });
  });
};
