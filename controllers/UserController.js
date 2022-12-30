const express = require('express')
const router = express.Router()
const nodemailer = require("nodemailer")
const host = "reportnftmarket@gmail.com"
const User = require('../models/User')

router.get('/:address', async (req, res) => {
    User.find({ wallet: req.params.address.toLowerCase() }, (err, data) => {
        if (err) return res.json({ success: false, error: err })
        User.find({ followers: req.params.address }, (err, followings) => {
            return res.json({ success: true, users: data, followings })
        })
    })
})

router.get('/', async (req, res) => {
    User.find((err, data) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true, users: data })
    })
})

router.post('/', async (req, res) => {
    User.find({ wallet: req.body.wallet }, function (err, user) {
        if (err) console.log(err)
        console.log(user)
        if (user.length == 0) {
            const newUser = new User(req.body);
            newUser.save(async function (err, added) {
                if (err) console.log(err);
                else {
                    res.json({ success: true })
                }
            })
        }
        else res.json({ success: true })
    })
})

router.put('/', async (req, res) => {
    User.findOneAndUpdate({ wallet: req.body.wallet }, req.body, async function (err, added) {
        if (err) console.log(err);
        else {
            res.json({ success: true })
        }
    });
})

router.put('/follow', async (req, res) => {
    console.log(req.body.me, req.body.follower)
    User.findOneAndUpdate({ wallet: req.body.me }, { $push: { followers: req.body.follower } }, async function (err, added) {
        if (err) console.log(err);
        else {
            res.json({ success: true })
        }
    });
})

router.put('/unfollow', async (req, res) => {
    User.findOneAndUpdate({ wallet: req.body.me }, { $pull: { followers: req.body.follower } }, async function (err, added) {
        if (err) console.log(err);
        else {
            res.json({ success: true })
        }
    });
})

router.post('/contact', async (req, res) => {
    User.find({ wallet: req.body.wallet }, async function (err, user) {
        if (err) console.log(err)
        console.log(user[0], req.body.msg)
        let transporter = nodemailer.createTransport({
            service: "gmail",
            debug: true,
            logger: true,
            auth: {
                user: host,
                pass: "dprqakcajocqrqxd"
                // user: "royarata0406@gmail.com",
                // pass: "utmpsfnajggnbwoe"
            }
        });

        let message = {
            from: user[0].email,
            to: host,
            subject: `New issues from user (${user[0].name})`,
            html: req.body.msg
        }

        await transporter.sendMail(message, function (err, info) {
            if (err) {
                console.log(err);
                res.status(400).send({ message: err });
            } else {
                console.log("Email sent");
                res.json({ success: true, info });
            }
        })
    })
})

module.exports = router