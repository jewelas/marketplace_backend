const express = require('express')
const router = express.Router()
const CryptoJS = require('crypto-js')

const Order = require('../models/Order')
const Item = require('../models/Item')
const Activity = require('../models/Activity')
const Collection = require('../models/Collection')
const TradeRecord = require('../models/TradeRecord')

router.get('/hotbids', async (req, res) => {
    Order.aggregate([
        { $match: { status: "open" } },
        {
            $lookup: {
                from: "items",
                localField: "tokenId",
                foreignField: "id",
                as: "details"
            },
        },
    ], (err, data) => {
        if (err) return res.json(err)
        else return res.json(data)
    }).sort({ "make.value": 'desc' }).limit(10)
})

router.get('/:hash', (req, res) => {
    const hash = req.params.hash;
    Order.findOne({ hash, status: "open" }).then(order => {
        if (!order) {
            return res.status(404).json({ error: 'Not Found' })
        }
        return res.json(order);
    }).catch(err => {
        return res.status(500).json(err);
    })
})

router.get('/orders/opened', (req, res) => {
    Order.find({ status: "open" }, (err, orders) => {
        if (err) return res.json({ success: false, error: err })
        return res.json(orders)
    })
})

router.get('/item/:token', (req, res) => {
    const [contract, tokenId] = req.params.token.split(":");
    Order.find({ status: "open" }).then(orders => orders.filter(order => order.take.assetType.contract === contract && order.take.assetType.tokenId === tokenId)).then(orders => {
        if (orders.length === 0) {
            return res.json({ error: 'Not Found' })
        }
        return res.json(orders);
    }).catch(err => {
        return res.status(500).json({ error: err })
    })
})

router.post('/byitem', async (req, res) => {
    Order.find({ collectionId: req.body.collectionId, tokenId: req.body.tokenId, status: "open" }, (err, data) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true, data })
    })
})

router.put('/', (req, res) => {
    const hash = "0x" + CryptoJS.SHA256(JSON.stringify(req.body.order)).toString(CryptoJS.enc.Hex);
    const newOrder = new Order({ ...req.body.order, hash });
    Order.find({ collectionId: req.body.order.collectionId, tokenId: req.body.order.tokenId, maker: req.body.order.maker }, function (err, existing) {
        if (err) console.log(err)
        else {
            if (existing.length == 0) {
                newOrder.save().then(data => {
                    Item.findOneAndUpdate({ collectionId: req.body.order.collectionId, id: req.body.order.tokenId }, { onsale: true }, function (err, aa) {
                        const newAct = new Activity(req.body.activity)
                        newAct.save(async function (err, act) {
                            if (err) console.log(err);
                            else {
                                return res.json(data)
                            }
                        })
                    })
                }).catch(err => {
                    return res.status(500).json(err)
                })
            } else {
                Order.deleteMany({ collectionId: req.body.order.collectionId, tokenId: req.body.order.tokenId, maker: req.body.order.maker }, function (err, dd) {
                    if (err) return err
                    else {
                        newOrder.save().then(data => {
                            Item.findOneAndUpdate({ collectionId: req.body.order.collectionId, id: req.body.order.tokenId }, { onsale: true }, function (err, aa) {
                                const newAct = new Activity(req.body.activity)
                                newAct.save(async function (err, act) {
                                    if (err) console.log(err);
                                    else {
                                        return res.json(data)
                                    }
                                });
                            }).catch(err => {
                                return res.status(500).json(err)
                            })
                        })
                    }
                })
            }
        }
    })
})

router.put('/accepted', (req, res) => {
    const [contract, tokenId] = req.body.itemId.split(":");
    console.log(req.body)
    Order.find({ status: "open" }).then(orders => orders.filter(order => {
        console.log(order)
        return order.take.assetType.contract === contract && order.take.assetType.tokenId === tokenId && order.hash == req.body.orderHash
    })).then(orders => {
        if (orders.length === 0) {
            return res.status(404).json({ error: 'No open Found' })
        }
        orders.map(order => {
            order.status = "closed";
            order.save();
        })
        Order.find({}).then(allOrders => allOrders.filter(order => order.take.assetType.contract === contract && order.take.assetType.tokenId === tokenId)).then(allOrders => {
            if (allOrders.length === 0) {
                return res.status(404).json({ error: 'All orders not Found' })
            }
        })
    })

    Order.findOne({ hash: req.body.orderHash }).then(order => {
        order.status = "success";
        order.save();
    })

    Item.findOneAndUpdate({ collectionId: contract, id: tokenId }, {
        owner: req.body.to, $push: {
            priceHistory: {
                date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
                price: req.body.price
            }
        }
    }, function (err, data) {
        if (err) console.log(err)
        Collection.findOneAndUpdate({ collectionId: contract }, { $inc: { 'volume': req.body.amount * req.body.price } }, async function (err, added) {
            if (err) console.log(err);
            else {
                const newTradeRecord = new TradeRecord({
                    collectionId: contract,
                    id: tokenId,
                    user: req.body.to,
                    amount: req.body.amount * req.body.price
                })
                newTradeRecord.save(async function (err, act) {
                    if (err) console.log(err);
                    else {
                        res.json({ success: true })
                    }
                });
            }
        });
    })
})

router.put('/bought', (req, res) => {
    const [contract, tokenId] = req.body.itemId.split(":");
    console.log(req.body)
    Order.find({ status: "open" }).then(orders => orders.filter(order => {
        console.log(order)
        return order.make.assetType.contract == contract && order.make.assetType.tokenId == tokenId
    })).then(orders => {
        if (orders.length === 0) {
            return res.status(404).json({ error: 'No open Found' })
        }
        orders.map(order => {
            order.status = "closed";
            order.save();
        })
        Order.find({}).then(allOrders => allOrders.filter(order => order.make.assetType.contract == contract && order.make.assetType.tokenId == tokenId)).then(allOrders => {
            if (allOrders.length === 0) {
                return res.status(404).json({ error: 'All orders not Found' })
            }
        })
    })

    Order.findOne({ hash: req.body.orderHash }).then(order => {
        order.status = "success";
        order.save();
    })

    Item.findOneAndUpdate({ collectionId: contract, id: tokenId }, {
        onsale: false, owner: req.body.to, $push: {
            priceHistory: {
                date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
                price: req.body.amount
            }
        }
    }, function (err, data) {
        if (err) console.log(err)
        Collection.findOneAndUpdate({ collectionId: contract }, { $inc: { 'volume': req.body.price * req.body.amount } }, async function (err, added) {
            if (err) console.log(err);
            else {
                const newTradeRecord = new TradeRecord({
                    collectionId: contract,
                    id: tokenId,
                    user: req.body.to,
                    amount: req.body.amount
                })
                newTradeRecord.save(async function (err, act) {
                    if (err) console.log(err);
                    else {
                        res.json({ success: true })
                    }
                });
            }
        });
    })
})

router.delete('/', async (req, res) => {
    Order.findOne({ collectionId: req.body.collectionId, tokenId: req.body.tokenId }, function (err, order) {
        Order.deleteMany({ collectionId: req.body.collectionId, tokenId: req.body.tokenId, maker: req.body.bidder }, function (err) {
            if (err) console.log(err)
            const newAct = new Activity(req.body.activity)
            newAct.save(async function (err, act) {
                if (err) console.log(err);
                else {
                    console.log("Bid canceled")
                    res.json({ success: true, orderRemoved: order })
                }
            });
        })
    })
})

module.exports = router