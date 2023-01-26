import joi from "joi";

export default joi.object({
  name: joi.string().optional(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});
