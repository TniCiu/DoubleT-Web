import Joi from 'joi';

export const createInvitationSchema = Joi.object({
  boardId: Joi.string().required(),
  invitedBy: Joi.string().required(),
  invitedUserEmail: Joi.string().email().required(),
});

export const validateCreateInvitation = (req, res, next) => {
  const { error } = createInvitationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
