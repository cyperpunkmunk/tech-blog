//require express
const router = require("express").Router();
//require all models
const { Post, User, Comment } = require("../../models");
//require connection file
const sequelize = require("../../config/connection");
//require authenticaiton 
const withAuth = require("../../utils/auth");

// GET all posts
router.get("/", (req, res) => {
  console.log("======================");
  Post.findAll({
    attributes: ["id", "title", "content", "created_at"],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData.reverse()))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET a single post
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST - creating a post 
router.post("/", withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update a post title
router.put("/:id", withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE a post 
router.delete("/:id", withAuth, (req, res) => {
 
  Post.findOne({
    where: {id: req.params.id},
    include: [Comment]
  })
  .then(post => {
    //find comments, delete them, and then delete post
    post.comments.forEach(comment => {
      comment.destroy();
    })
    post.destroy();
    res.end();
  })
});

module.exports = router;