const express = require('express')
const Activity = require('../models/Activity')
const router = express.Router()

const Bid = require('../models/Bid')
const Item = require('../models/Item')

router.post('/', async (req, res) => {
    Item.find({ collectionId: req.body.collectionId }, (err, itemData) => {
        if (err) return res.json({ success: false, error: err })
        const bidData = itemData.map(x => {
            return {
                collectionId: x.collectionId,
                tokenId: x.id,
                bidder: req.body.bidder,
                bidAmount: req.body.bidAmount,
                bidExpiration: req.body.bidExpiration
            }
        })
        if (req.body.isCollectionBid) {
            Bid.remove({}, function (err) {
                if (err) console.log(err)
                console.log("All removed")
                Bid.insertMany(bidData).then(function () {
                    const newAct = new Activity(req.body.activity)
                    newAct.save(async function (err, act) {
                        if (err) console.log(err);
                        else {
                            console.log("All bids added")
                            res.json({ success: true })
                        }
                    });
                }).catch(function (error) {
                    console.log(error)
                })
            })
        } else {
            Bid.find({ collectionId: req.body.collectionId, tokenId: req.body.tokenId }, function (err, bidData) {
                if (err) console.log(err)
                if (bidData.length > 0) {
                    Bid.updateMany({ collectionId: req.body.collectionId, tokenId: req.body.tokenId }, { bidAmount: req.body.bidAmount, bidExpiration: req.body.bidExpiration }, function (err, updated) {
                        if (err) console.log(err)
                        const newAct = new Activity(req.body.activity)
                        newAct.save(async function (err, act) {
                            if (err) console.log(err);
                            else {
                                console.log("One bid updated")
                                res.json({ success: true })
                            }
                        });
                    })
                }
                else {
                    const newBid = new Bid(req.body)
                    newBid.save(async function (err, added) {
                        if (err) console.log(err)
                        const newAct = new Activity(req.body.activity)
                        newAct.save(async function (err, act) {
                            if (err) console.log(err);
                            else {
                                console.log("One bid added")
                                res.json({ success: true })
                            }
                        });
                    })
                }
            })
        }
    })
})

module.exports = router