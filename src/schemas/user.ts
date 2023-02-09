import joi from "joi";

export default joi.object({
  name: joi.string().allow(""),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});
