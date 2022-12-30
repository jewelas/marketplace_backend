const express = require('express')
const validator = require('validator')
const router = express.Router()

const User = require('../models/User')
const Collection = require('../models/Collection')
const TradeRecord = require('../models/TradeRecord')

router.get('/', async (req, res) => {
    Collection.aggregate([
        { $match: {} },
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
                from: "items",
                localField: "collectionId",
                foreignField: "collectionId",
                as: "tokenIds"
            },
        },
    ], (err, dataWithoutUserInfo) => {
        if (err) return res.json(err)
        else {
            User.find((err, users) => {
                if (err) return res.json({ success: false, error: err })
                const data = dataWithoutUserInfo.map(x => {
                    return {
                        ...x,
                        tokenIds: x.tokenIds.map(y => {
                            return {
                                ...y,
                                creatorInfo: users.filter(z => z.wallet == y.creator),
                                ownerInfo: users.filter(z => z.wallet == y.owner),
                            }
                        })
                    }
                })
                return res.json(data)
            })
        }
    })
})

router.get('/top/:limit', async (req, res) => {
    Collection.aggregate([
        { $match: {} },
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
                from: "items",
                localField: "collectionId",
                foreignField: "collectionId",
                as: "tokenIds"
            },
        },
        {
            $lookup: {
                from: "orders",
                localField: "collectionId",
                foreignField: "collectionId",
                as: "order"
            },
        },
        {
            $lookup: {
                from: "traderecords",
                localField: "collectionId",
                foreignField: "collectionId",
                as: "trade"
            },
        }
    ], (err, dataWithoutUserInfo) => {
        if (err) return res.json(err)
        else {
            User.find((err, users) => {
                if (err) return res.json({ success: false, error: err })
                const data = dataWithoutUserInfo.map(x => {
                    return {
                        ...x,
                        tokenIds: x.tokenIds.map(y => {
                            return {
                                ...y,
                                creatorInfo: users.filter(z => z.wallet == y.creator),
                                ownerInfo: users.filter(z => z.wallet == y.owner),
                            }
                        })
                    }
                })
                return res.json(data)
            })
        }
    }).limit(req.params.limit.toString() == "10" ? 10 : 99999)
})

router.get('/:id', async (req, res) => {
    Collection.aggregate([
        { $match: { collectionId: req.params.id } },
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
                from: "items",
                localField: "collectionId",
                foreignField: "collectionId",
                as: "tokenIds"
            },
        },
    ], (err, dataWithoutUserInfo) => {
        if (err) return res.json(err)
        else {
            User.find((err, users) => {
                if (err) return res.json({ success: false, error: err })
                const data = dataWithoutUserInfo.map(x => {
                    return {
                        ...x,
                        tokenIds: x.tokenIds.map(y => {
                            return {
                                ...y,
                                creatorInfo: users.filter(z => z.wallet == y.creator),
                                ownerInfo: users.filter(z => z.wallet == y.owner),
                            }
                        })
                    }
                })
                return res.json(data)
            })
        }
    })
})

router.post('/', async (req, res) => {
    const newCollection = new Collection({
        blockchain: req.body.blockchain,
        single: req.body.single,
        collectionId: req.body.collectionId,
        category: req.body.category,
        image: req.body.image,
        name: req.body.name,
        symbol: req.body.symbol,
        description: req.body.description,
        owner: req.body.owner,
        standard: req.body.standard,
        website: req.body.website,
        telegram: req.body.telegram,
        discord: req.body.discord,
        twitter: req.body.twitter,
    })
    Collection.find({ collectionId: req.body.collectionId }, function (err, exist) {
        if (err) console.log(err)
        if (exist.length > 0) res.json({ success: false })
        else {
            newCollection.save(async function (err, added) {
                if (err) console.log(err);
                else {
                    res.json({ success: true })
                }
            });
        }
    });
})

router.post('/like', async (req, res) => {
    console.log(req.body)
    Collection.findOneAndUpdate({ collectionId: req.body.collectionId }, { $push: { likes: req.body.wallet } }, async function (err, added) {
        if (err) console.log(err);
        else {
            // const newAct = new Activity(req.body.activity)
            // newAct.save(async function (err, act) {
            //     if (err) console.log(err);
            //     else {
            res.json({ success: true })
            //     }
            // });
        }
    });
})

router.post('/dislike', async (req, res) => {
    Collection.findOneAndUpdate({ collectionId: req.body.collectionId }, { $pull: { likes: req.body.wallet } }, async function (err, added) {
        if (err) console.log(err);
        else {
            // const newAct = new Activity(req.body.activity)
            // newAct.save(async function (err, act) {
            //     if (err) console.log(err);
            //     else {
            res.json({ success: true })
            //     }
            // });
        }
    });
})

router.put('/updateVolume', async (req, res) => {
    Collection.findOneAndUpdate({ collectionId: req.body.collectionId }, { $inc: { 'volume': req.body.amount } }, async function (err, added) {
        if (err) console.log(err);
        else {
            const newTradeRecord = new TradeRecord(req.body)
            newTradeRecord.save(async function (err, act) {
                if (err) console.log(err);
                else {
                    res.json({ success: true })
                }
            });
        }
    });
})

router.put('/savecover', async (req, res) => {
    Collection.findOneAndUpdate({ owner: req.body.wallet, collectionId: req.body.collectionId }, { cover: req.body.cover }, async function (err, added) {
        if (err) console.log(err);
        else {
            res.json({ success: true })
        }
    })
})

router.put('/verify_request', async (req, res) => {
    Collection.findOne({ owner: req.body.wallet }, async function (err, owner) {
        if (err) {
            console.log(err)
            res.json({ success: false })
        }
        else
            Collection.findOneAndUpdate({ collectionId: req.body.collectionId }, { verified: 0 }, async function (err, added) {
                if (err) console.log(err);
                else {
                    res.json({ success: true })
                }
            })
    })
})

router.post('/verify', async (req, res) => {
    Collection.findOneAndUpdate({ collectionId: req.body.collectionId }, { verified: 1 }, async function (err, added) {
        if (err) console.log(err);
        else {
            Collection.aggregate([
                { $match: {} },
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
                        from: "items",
                        localField: "collectionId",
                        foreignField: "collectionId",
                        as: "tokenIds"
                    },
                },
            ], (err, dataWithoutUserInfo) => {
                if (err) return res.json(err)
                else {
                    User.find((err, users) => {
                        if (err) return res.json({ success: false, error: err })
                        const data = dataWithoutUserInfo.map(x => {
                            return {
                                ...x,
                                tokenIds: x.tokenIds.map(y => {
                                    return {
                                        ...y,
                                        creatorInfo: users.filter(z => z.wallet == y.creator),
                                        ownerInfo: users.filter(z => z.wallet == y.owner),
                                    }
                                })
                            }
                        })
                        return res.json(data)
                    })
                }
            })
        }
    })
})

module.exports = router