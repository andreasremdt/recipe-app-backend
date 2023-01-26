import joi from "joi";

export default joi.object({
  title: joi.string().max(255).required(),
  description: joi.string(),
  thumbnailUrl: joi.string(),
  ingredients: joi.string(),
  instructions: joi.string(),
  rating: joi.number().min(1).max(5),
  trashed: joi.boolean(),
  difficulty: joi.string(),
  timeNeeded: joi.number(),
});
