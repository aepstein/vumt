const express = require('express');
const router = express.Router();

const Advisory = require('../../models/Advisory');

// @route GET api/advisories
// @desc Get all advisories
// @access Public
router.get('/', async (req, res) => {
    try {
        const advisories = await Advisory.find()
        return res.json(advisories)
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg: 'Error'})
    }
});

module.exports = router;
