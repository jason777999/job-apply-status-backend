import { Router } from "express";
import { Request, Response } from "express";
import JobLink from "../Model/JobLink";
import jobLinkAddValidation from "../validation/jobLinkAddValidation";
import { validationResult } from "express-validator";
import User from "../Model/User";
import mongoose, { Types } from "mongoose";
import * as _ from "lodash";

const router = Router();

const getAllJobLinks = (req: Request, res: Response) => {
  JobLink.find()
    .sort({ date: -1 })
    .then((jobLinks) => {
      res.json({
        success: true,
        jobList: jobLinks,
        message: "Fetched success",
      });
    });
};

const addJobLink = (req: Request, res: Response) => {
  // console.log("ADD JOB LINK API", req.body);

  let { errors }: any = validationResult(req);

  if (!_.isEmpty(errors)) {
    res.json({
      success: false,
      errors: errors.map((err: any) => err.msg),
    });
  }
  //
  else {
    let { link, email, userId } = req.body;
    userId = new Types.ObjectId(userId);

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
          JobLink.findOne({ link })
            .then((jobLink) => {
              // update
              if (jobLink) {
                // Check if arr includes object b using lodash's isEqual function
                // let applied = jobLink.linker.some((item) => {
                //   return _.isEqual(JSON.stringify(item), JSON.stringify(user));
                // });

                if (jobLink.applied) {
                  res.json({
                    success: false,
                    message: "You have already allied for this job",
                  });
                }
                //
                else {
                  jobLink.linker.push(user);
                  jobLink.applied = true;
                  jobLink
                    .save()
                    .then((saved) => {
                      res.json({
                        success: true,
                        saved,
                        message: "Job Updated!",
                      });
                    })
                    .catch((err) => {
                      // console.log(err);
                      res.json({
                        success: false,
                        message: "Server Error",
                      });
                    });
                }
              }
              // add
              else {
                let newJobLink = new JobLink({
                  link,
                  linker: [user],
                  applied: true,
                });
                newJobLink
                  .save()
                  .then((saved) => {
                    res.json({
                      success: true,
                      saved,
                    });
                  })
                  .catch((err) => {
                    // console.log(err);
                    res.json({
                      success: false,
                      message: "Server error",
                    });
                  });
              }
            })
            .catch((err) => {
              // console.log(err);
              res.json({
                success: false,
                message: "Server error",
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

const removeJobLink = (req: Request, res: Response) => {
  let { errors }: any = validationResult(req);
  console.log("Remove job Link API", req.body);

  if (!_.isEmpty(errors)) {
    res.json({
      success: false,
      errors,
    });
  }
  //
  else {
    let { link, userId, email } = req.body;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          console.log("User does not exist!");
          res.json({
            success: false,
            message: "You Have to Register!",
          });
        }
        // if user is valid
        else {
          JobLink.findOne({ link })
            .then((jobLink) => {
              // remove
              if (jobLink) {
                if (jobLink.applied) {
                  let linker = [...jobLink.linker];
                  let [removed] = _.remove(linker, {
                    _id: new Types.ObjectId(userId),
                    email,
                  });

                  console.log("Removed : ", removed);
                  jobLink.linker = [...linker];
                  jobLink.applied = false;
                  jobLink
                    .save()
                    .then((removed) => {
                      res.json({
                        success: true,
                        removed,
                        message: "removed successfully",
                      });
                      // console.log("Removed!", removed);
                    })
                    .catch((err) => {
                      // console.log(err);
                      res.json({
                        success: false,
                        message: "Server Error",
                      });
                    });
                }
                //
                else {
                  res.json({
                    success: false,
                    message: "You have not applied for this job yet.",
                  });
                }
              }
              //
              else {
                res.json({
                  success: false,
                  message: "Link does not exist!",
                });
              }
            })
            .catch((err) => {
              // console.log(err);
              res.json({
                success: false,
                message: "Server error",
              });
            });
        }
      })
      .catch((err) => {
        // console.log(err);
        res.json({
          success: false,
          message: "Server Error",
        });
      });
  }
};

router.get("/", getAllJobLinks);

router.post("/add", jobLinkAddValidation, addJobLink);

router.post("/delete", jobLinkAddValidation, removeJobLink);

export default router;
