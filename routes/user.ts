import { Router } from "express";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import User from "../Model/User";
import * as _ from "lodash";
import userLoginValidation from "../validation/userLoginValidation";
import passport = require("passport");

const router = Router();

const userLogin = (req: Request, res: Response) => {
  console.log("User Login Api");

  console.log(req.body);

  let { errors }: any = validationResult(req);

  // Input Validation.
  if (!_.isEmpty(errors)) {
    res.json({
      success: false,
      errors: errors.map((err) => err.msg),
    });
  } else {
    let { email } = req.body;
    User.findOne({ email }).then((user) => {
      // Email Validation
      if (!user) {
        res.json({
          success: false,
          errors: [
            {
              path: "emai",
              msg: "Email doesn't exsits!",
            },
          ],
        });
      }
      //
      else {
        res.json({
          success: true,
          user,
        });
      }
    });
  }
};

const userRegister = (req: Request, res: Response) => {
  console.log("User Register Api");

  let { errors }: any = validationResult(req);

  // Input Validation.
  if (!_.isEmpty(errors)) {
    res.json({
      success: false,
      errors,
    });
  } else {
    let { email } = req.body;
    User.findOne({ email }).then((user) => {
      // Email Validation
      if (user) {
        res.json({
          success: false,
          errors: ["Email already exists!"],
        });
      }
      //
      else {
        new User(req.body).save().then((user) => {
          res.json({
            success: true,
            user,
            message: "Register Success!",
          });
        });
      }
    });
  }
};

const test = (req: Request, res: Response) => {
  res.send("User Api works!");
};

// @ public
// route : /api/user/login
// user login
router.post("/login", userLoginValidation, userLogin);

// @ public
// route : /api/user/register
// user login
router.post("/register", userLoginValidation, userRegister);

// @ public
// route : /api/user/test
// user api test
router.get("/test", test);

export default router;
