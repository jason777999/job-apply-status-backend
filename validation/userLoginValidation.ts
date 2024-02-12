import { body } from "express-validator";

const userLoginValidation = [
  body("email")
    .notEmpty()
    .withMessage("This is required!")
    .isEmail()
    .withMessage("This is not Email"),
];

export default userLoginValidation;
