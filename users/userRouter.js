const express = require("express");
const db = require("./userDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  // do your magic!
  const user = req.body;
  db.insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Couldn't add user" });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const body = req.body.text;
  db.getById(id).then(user => {
    user
      ? db
          .insert(body)
          .then(post => {
            res.status(201).json(post);
          })
          .catch(err => {
            res.status(500).json({ message: "couldn't save to database" });
          })
      : res.status(404).json({ message: "user does not exist" });
  });
  // const user_id = req.params.id;
  // const post = { ...req.body, user_id };
  // db.insert(post)
  //   .then(user => {
  //     res.status(201).json(user);
  //   })
  //   .catch(err => {
  //     res.status(400).json({ message: "Couldn't add post" });
  //   });
});

router.get("/", (req, res) => {
  // do your magic!
  db.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Error getting users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!
  db.getUserPosts(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res
        .status(404)
        .json({ message: "Post of specified user does not exist" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  db.remove(id)
    .then(user => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(404).json({ message: "Error, user does not exist" });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  const changes = req.body;
  db.update(req.user, changes)
    .then(update => {
      res.status(200).json(update);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Error, the post information could not be modified" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;

  db.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next({ message: "user id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "failed ", err });
    });
}

function validateUser(req, res, next) {
  // do your magic!
  if (req.body.length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
