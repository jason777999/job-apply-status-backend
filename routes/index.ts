import { Router, Request, Response } from "express";
import user from "./user";
import jobLink from "./jobLInk";
import * as passport from "passport";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  const resMessage =
    '<h1 style = "color : red; text-align : center;"> Server is working </h1>';
  res.send(resMessage);
});

router.get(
  "/auth-path",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      userData: req.user,
    });
  }
);

router.use("/user", user);
router.use("/job-link", jobLink);

export default router;
