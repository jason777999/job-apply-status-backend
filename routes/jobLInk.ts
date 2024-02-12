import { Router } from "express";
import { Request, Response } from "express";
import JobLink from "../Model/JobLink";
import jobLinkAddValidation from "../validation/jobLinkAddValidation";
import { validationResult } from "express-validator";
import User from "../Model/User";
import { Types } from "mongoose";
import * as _ from "lodash";

const router = Router();

const getAllJobLinks = (req: Request, res: Response) => {
  JobLink.find().then((jobLinks) => {
    res.json({
      success: true,
      jobList: jobLinks,
      message: "Fetched success",
    });
  });
};

const addJobLink = (req: Request, res: Response) => {
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
                let applied = jobLink.linker.some((item) => {
                  return _.isEqual(JSON.stringify(item), JSON.stringify(user));
                });

                if (applied) {
                  res.json({
                    success: false,
                    error: "You have already allied for this job",
                  });
                }
                //
                else {
                  jobLink.linker.push(user);
                  jobLink
                    .save()
                    .then((saved) => {
                      res.json({
                        success: true,
                        saved,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.json({
                        success: false,
                        error: "Server Error",
                      });
                    });
                }
              }
              // add
              else {
                let newJobLink = new JobLink({ link, linker: [user] });
                newJobLink
                  .save()
                  .then((saved) => {
                    res.json({
                      success: true,
                      saved,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json({
                      success: false,
                      msg: "Server error",
                    });
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              res.json({
                success: false,
                msg: "Server error",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          success: false,
          msg: "Server Error",
        });
      });
  }
};

const removeJobLink = (req: Request, res: Response) => {
  let { errors }: any = validationResult(req);

  if (!_.isEmpty(errors)) {
    res.json({
      success: false,
      errors,
    });
  }
  //
  else {
    let { link, userId } = req.body;

    User.findById(userId)
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
              if (jobLink) {
                if (jobLink.linker.includes(userId)) {
                  jobLink.linker.splice(jobLink.linker.indexOf(userId), 1);
                  jobLink
                    .save()
                    .then((saved) => {
                      res.json({
                        success: true,
                        saved,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.json({
                        success: false,
                        error: "Server Error",
                      });
                    });
                } else {
                  res.json({
                    success: false,
                    error: "You have not applied for this job yet.",
                  });
                }
              }
              // add
              else {
                new JobLink({ link, linker: [userId] })
                  .save()
                  .then((saved) => {
                    return {
                      success: true,
                      saved,
                    };
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json({
                      success: false,
                      msg: "Server error",
                    });
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              res.json({
                success: false,
                msg: "Server error",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          success: false,
          msg: "Server Error",
        });
      });
  }
};

router.get("/", getAllJobLinks);

router.post("/add", jobLinkAddValidation, addJobLink);

router.get("/delete", jobLinkAddValidation, removeJobLink);

export default router;
