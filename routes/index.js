const { Router } = require("express");

const userRouter = require("./user-route");

const router = Router();

router.use("/api/v1/users", userRouter);

module.exports = router;