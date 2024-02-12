import { Router } from "express";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../Model/User";
import mongoose, { Types } from "mongoose";
import * as _ from "lodash";
import Note from "../Model/Note";
import noteAddValidation from "../validation/noteAddValidation";

const router = Router();

const getAllNotes = (req: Request, res: Response) => {
  Note.find().then((notes) => {
    res.json({
      success: true,
      notes,
      message: "Fetched success",
    });
  });
};

const addNote = (req: Request, res: Response) => {
  console.log("ADD NOTE API", req.body);

  let { errors }: any = validationResult(req);

  if (!_.isEmpty(errors)) {
    res.json({
      success: false,
      errors: errors.map((err: any) => err.msg),
    });
  }
  //
  else {
    let { text, email } = req.body;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.json({
            success: false,
            error: "You Have to Register!",
          });
        }
        // if user is valid
        else {
          new Note({ text, writer: user }).save().then((note) => {
            res.json({
              success: true,
              note,
              msg: "Note Added",
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          success: false,
          message: "Server Error",
        });
      });
  }
};

router.get("/", getAllNotes);

router.post("/add", noteAddValidation, addNote);

export default router;
