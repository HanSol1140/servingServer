const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get("/test1", async (req, res) => {
    res.send("test1");
});
router.get("/test2", async (req, res) => {
    res.send("test2");
});

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(`http://192.168.0.3/reeman/current_version`);
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
        console.log("error : ", error);
    }
});

module.exports = router;