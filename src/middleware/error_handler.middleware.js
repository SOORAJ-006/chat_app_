import { HttpStatusCodes } from "../constant";

export const error_handling = (error, req, res, next) => {
  console.log(error.stack);
  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    message:resMessage.serverError,
    error: error.message
  })

}