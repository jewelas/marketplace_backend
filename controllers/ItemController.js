const express = require('express')
const Activity = require('../models/Activity')
const router = express.Router()

const Item = require('../models/Item')

router.get('/', async (req, res) => {
    Item.aggregate([
        { $match: {} },
        {
            $lookup: {
                from: "collections",
                localField: "collectionId",
                foreignField: "collectionId",
                as: "collectionInfo"
            },
        },
        {
            $lookup: {
                from: "orders",
                localField: "id",
                foreignField: "tokenId",
                as: "order"
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "wallet",
                as: "ownerInfo"
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "wallet",
                as: "creatorInfo"
            },
        },
    ], (err, data) => {
        if (err) return res.json(err)
        else return res.json(data)
    })
})

router.get('/:token', async (req, res) => {
    const code = req.params.token.split(":")
    Item.aggregate([
        { $match: { collectionId: code[0], id: code[1] } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "wallet",
                as: "ownerInfo"
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "wallet",
                as: "creatorInfo"
            },
        },
    ], (err, data) => {
        if (err) return res.json({ success: false, error: err })
        else return res.json({ success: true, items: data })
    })
})

router.post('/', async (req, res) => {
    const newItem = new Item(req.body);
    newItem.save(async function (err, added) {
        if (err) console.log(err);
        else {
            const newAct = new Activity(req.body.activity)
            newAct.save(async function (err, act) {
                if (err) console.log(err);
                else {
                    res.json({ success: true })
                }
            });
        }
    });
})

router.post('/import', async (req, res) => {
    console.log(req.body.items)
    Item.insertMany(req.body.items).then(r=>{
        res.json({success: true})
    }).catch(e => console.log(e))
})

router.post('/like', async (req, res) => {
    Item.findOneAndUpdate({ collectionId: req.body.collectionId, id: req.body.id }, { $push: { likes: req.body.wallet } }, async function (err, added) {
        if (err) console.log(err);
        else {
            const newAct = new Activity(req.body.activity)
            newAct.save(async function (err, act) {
                if (err) console.log(err);
                else {
                    res.json({ success: true })
                }
            });
        }
    });
})

router.post('/dislike', async (req, res) => {
    Item.findOneAndUpdate({ collectionId: req.body.collectionId, id: req.body.id }, { $pull: { likes: req.body.wallet } }, async function (err, added) {
        if (err) console.log(err);
        else {
            const newAct = new Activity(req.body.activity)
            newAct.save(async function (err, act) {
                if (err) console.log(err);
                else {
                    res.json({ success: true })
                }
            });
        }
    });
})

router.put('/saveprice', async (req, res) => {
    Item.findOneAndUpdate({ collectionId: req.body.collectionId, id: req.body.tokenId }, { price: req.body.value }, async function (err, added) {
        if (err) console.log(err);
        else {
            res.json({ success: true })
        }
    })
})

router.put('/change_saletype', async (req, res) => {
    Item.findOneAndUpdate({ collectionId: req.body.collectionId, id: req.body.tokenId }, { saletype: req.body.value }, async function (err, added) {
        if (err) console.log(err);
        else {
            res.json({ success: true })
        }
    })
})

module.exports = router