import { body } from "express-validator";

const jobLinkAddValidation = [
  body("userId").notEmpty().withMessage("Check your input"),
  body("link").notEmpty().withMessage("Check your input"),
];

export default jobLinkAddValidation;
