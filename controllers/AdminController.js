const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

router.get("/", async (req, res) => {
  Admin.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, users: data });
  });
});

router.post("/", async (req, res) => {
  Admin.find({ address: req.body.address }, function (err, user) {
    if (err) console.log(err);
    if (user.length == 0) {
      const newUser = new Admin(req.body);
      newUser.save(async function (err, added) {
        if (err) console.log(err);
        else {
          Admin.find((err, data) => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true, users: data });
          });
        }
      });
    } else {
      Admin.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, users: data });
      });
    }
  });
});

router.delete("/", async (req, res) => {
  Admin.deleteMany({ address: req.body.address }, function (err) {
    if (err) console.log(err);
    Admin.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, users: data });
    });
  });
});

module.exports = router;
