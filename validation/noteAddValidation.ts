import { body } from "express-validator";

const noteAddValidation = [
  body("email").notEmpty().withMessage("Check your input"),
  body("text").notEmpty().withMessage("Check your input"),
];

export default noteAddValidation;
