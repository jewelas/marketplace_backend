const express = require('express')
const router = express.Router()

const Activity = require('../models/Activity')

router.get('/:wallet', async (req, res) => {
    Activity.aggregate([
        { $match: { user: req.params.wallet } },
        {
            $lookup: {
                from: "collections",
                localField: "collectionId",
                foreignField: "collectionId",
                as: "collection"
            },
        },
    ], (err, data) => {
        if (err) return res.json(err)
        else return res.json(data)
    })
})

router.get('/bytokenId/:tokenId', async (req, res) => {
    Activity.aggregate([
        { $match: { tokenId: req.params.tokenId } },
        {
            $lookup: {
                from: "collections",
                localField: "collectionId",
                foreignField: "collectionId",
                as: "collection"
            },
        },
    ], (err, data) => {
        if (err) return res.json(err)
        else {
            return res.json(data)
        }
    })
})

module.exports = router