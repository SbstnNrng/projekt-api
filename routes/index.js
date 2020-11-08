var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    const data = {
        data: {
            title: "Om mig",
            info: "Mitt namn är Sebastian, jag går andra året på Webbprogrammering vid BTH."
            + "Detta är mitt första försök till en app skapad med React."
        }
    };

    res.json(data);
});

module.exports = router;
