//importing express router 
const router = require("express").Router();

//setting up router use variables 
const userRoutes = require("./user-routes");
const postRoutes = require("./post-routes");
const commentRoutes = require("./comment-routes");

//setting up routes 
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

//exporting router
module.exports = router;