const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/objects.sqlite');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

var jwtSecret = process.env.JWT_SECRET;

router.get("/", 
    (req, res, next) => checkToken(req, res, next),
    (req, res) => getObjects(res, req));

router.put("/", (req, res) => updatePrice(res, req.body));

router.put("/buy",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => buy(res, req.body));

router.put("/sell",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => sell(res, req.body));

function checkToken(req, res, next) {
    var token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, jwtSecret, function(err) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: req.path,
                        title: "Failed authentication",
                        detail: err.message
                    }
                });
            }

            next();

            return undefined;
        });
    } else {
        return res.status(401).json({
            errors: {
                status: 401,
                source: req.path,
                title: "No token",
                detail: "No token provided in request headers"
            }
        });
    }
}

function getObjects(res, req) {
    var sql = "SELECT * FROM objects";

    db.all(sql, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({
            "message": "success",
            "data": rows
        });
    });
}

function updatePrice(res, body) {
    var applePrice = body.applePrice;
    var orangePrice = body.orangePrice;
    var pineapplePrice = body.pineapplePrice;
    var bananaPrice = body.bananaPrice;
    var pearPrice = body.pearPrice;

    if (!applePrice || !orangePrice || !pineapplePrice || !bananaPrice || !pearPrice) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/objects",
                title: "Price missing",
                detail: "Price missing in request"
            }
        });
    }

    db.all("UPDATE objects SET applePrice = ?, orangePrice = ?, pineapplePrice = ?, bananaPrice = ?, pearPrice = ?",
        applePrice,
        orangePrice,
        pineapplePrice,
        bananaPrice,
        pearPrice, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Price succesfully updated."
                }
            });
        }
    );
}

function buy(res, body) {
    var apple = body.appleStock;
    var orange = body.orangeStock;
    var pineapple = body.pineappleStock;
    var banana = body.bananaStock;
    var pear = body.pearStock;
    var selected = body.selected;
    var amount = body.amount;
    var newAmount = 0;

    if (selected == "apple") {
        newAmount = parseInt(apple) - parseInt(amount);
    } else if (selected == "orange") {
        newAmount = parseInt(orange) - parseInt(amount);
    } else if (selected == "pineapple") {
        newAmount = parseInt(pineapple) - parseInt(amount);
    } else if (selected == "banana") {
        newAmount = parseInt(banana) - parseInt(amount);
    } else if (selected == "pear") {
        newAmount = parseInt(pear) - parseInt(amount);
    }

    if (!selected || !amount) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/objects/buy",
                title: "Price missing",
                detail: "Price missing in request"
            }
        });
    }

    console.log(selected);
    console.log(newAmount);
    var sql = "UPDATE objects SET " + selected + " = " + newAmount + ";";
    console.log(sql);
    db.all(sql, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Amount succesfully updated."
                }
            });
        }
    );
}

function sell(res, body) {
    var apple = body.appleStock;
    var orange = body.orangeStock;
    var pineapple = body.pineappleStock;
    var banana = body.bananaStock;
    var pear = body.pearStock;
    var selected = body.selected;
    var amount = body.amount;
    var newAmount = 0;

    if (selected == "apple") {
        newAmount = parseInt(apple) + parseInt(amount);
    } else if (selected == "orange") {
        newAmount = parseInt(orange) + parseInt(amount);
    } else if (selected == "pineapple") {
        newAmount = parseInt(pineapple) + parseInt(amount);
    } else if (selected == "banana") {
        newAmount = parseInt(banana) + parseInt(amount);
    } else if (selected == "pear") {
        newAmount = parseInt(pear) + parseInt(amount);
    }

    if (!selected || !amount) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/objects/sell",
                title: "Price missing",
                detail: "Price missing in request"
            }
        });
    }

    console.log(selected);
    console.log(newAmount);
    var sql = "UPDATE objects SET " + selected + " = " + newAmount + ";";
    console.log(sql);
    db.all(sql, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/sell",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Amount succesfully updated."
                }
            });
        }
    );
}

module.exports = router;
