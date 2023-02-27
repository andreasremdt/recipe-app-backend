import joi from "joi";

export default joi.object({
  title: joi.string().max(255).required(),
  description: joi.string().allow(""),
  thumbnailUrl: joi.string().allow(""),
  ingredients: joi.string().allow(""),
  instructions: joi.string().allow(""),
  rating: joi.number().min(1).max(5),
  trashed: joi.boolean(),
  difficulty: joi.string(),
  timeNeeded: joi.number(),
});
