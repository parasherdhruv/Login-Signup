const express = require("express");
const mongoose = require("mongoose");
const user = require("../model/user");
const User = require("../model/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

//GET REQUEST

router.get("/",checkAuth, (req, res, next) => {
  User.find()
    .then((result) => {
      res.status(200).json({
        userData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//GET BY ID REQUEST

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  User.findById(req.params.id).then((result) => {
    res
      .status(200)
      .json({
        user: result,
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
});

//POST REQUEST

router.post("/", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      // const user = new User({
      //     _id: new mongoose.Types.ObjectId,
      //     username: req.body.username,
      //     password: hash,
      //     phoneno: req.body.phoneno,
      //     email: req.body.email,
      //     userType: req.body.userType
      // })

      new User(req.body)
        .save()
        .then((result) => {
          console.log(result);
          res.status(200).json({
            newUser: result,
          });
        })

        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  user
    .find({
      username: req.body.username,
    })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          msg: "user not found",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            msg: "password match fail",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              userType: user[0].userType,
              email: user[0].email,
              phoneno: user[0].phoneno,
            },
            "this is dummy text",
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            username: user[0].username,
            userType: user[0].userType,
            email: user[0].email,
            phoneno: user[0].phoneno,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
});

//DELETE REQUEST
router.delete("/:id", checkAuth, (req, res, next) => {
  user
    .remove({
      _id: req.params.id,
    })
    .then((result) => {
      res.status(200).json({
        msg: "user deleted",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//PUT REQUEST
router.put("/:id", checkAuth, (req, res, next) => {
  console.log(req.params.id);

  user
    .findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          username: req.body.username,
          password: hash,
          phoneno: req.body.phoneno,
          email: req.body.email,
          userType: req.body.userType,
        },
      }
    )
    .then((result) => {
      res.status(200).json({
        updated_User: result,
      });
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
