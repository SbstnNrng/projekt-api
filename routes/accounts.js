const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/accounts.sqlite');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

var jwtSecret = process.env.JWT_SECRET;

router.post("/", (req, res) => createAccount(res, req.body));
router.get("/", 
    (req, res, next) => checkToken(req, res, next),
    (req, res) => getAccount(res, req));

router.put("/", 
    (req, res, next) => checkToken(req, res, next),
    (req, res) => addBalance(res, req.body));

router.put("/buy", 
    (req, res, next) => checkToken(req, res, next),
    (req, res) => buy(res, req.body));

router.put("/sell", 
    (req, res, next) => checkToken(req, res, next),
    (req, res) => sell(res, req.body));

function createAccount(res, body) {
    const email = body.email;

    if (!email) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/accounts",
                title: "Email missing",
                detail: "Email missing in request"
            }
        });
    }
    db.run("INSERT INTO accounts (email) VALUES (?)",
        email, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/accounts",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Account succesfully created"
                }
            });
        }
    );
}

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

function getAccount(res, req) {
    const email = req.headers['email'];

    var sql = "SELECT * FROM accounts WHERE email LIKE ?";

    db.all(sql, email, (err, rows) => {
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

function addBalance(res, body) {
    var email = body.email;
    var balance = parseInt(body.balance);
    var addBalance = parseInt(body.addBalance);
    var newBalance = balance + addBalance;

    if (!email || !addBalance) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/reports/edit",
                title: "Title or info missing",
                detail: "Title or info missing in request"
            }
        });
    }

    db.all("UPDATE accounts SET balance = ? WHERE email = ?",
        newBalance,
        email, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/accounts/",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Balance succesfully updated."
                }
            });
        }
    );
}

function buy(res, body) {
    var email = body.email;
    var balance = body.balance;
    var cost = body.cost;
    var newBalance = 0;
    var applePrice = body.applePrice;
    var orangePrice = body.orangePrice;
    var pineapplePrice = body.pineapplePrice;
    var bananaPrice = body.bananaPrice;
    var pearPrice = body.pearPrice;
    var apple = body.appleAccount;
    var orange = body.orangeAccount;
    var pineapple = body.pineappleAccount;
    var banana = body.bananaAccount;
    var pear = body.pearAccount;
    var selected = body.selected;
    var amount = body.amount;
    var newAmount = 0;

    if (selected == "apple") {
        newAmount = parseInt(apple) + parseInt(amount);
        cost = parseInt(applePrice) * parseInt(amount);
    } else if (selected == "orange") {
        newAmount = parseInt(orange) + parseInt(amount);
        cost = parseInt(orangePrice) * parseInt(amount);
    } else if (selected == "pineapple") {
        newAmount = parseInt(pineapple) + parseInt(amount);
        cost = parseInt(pineapplePrice) * parseInt(amount);
    } else if (selected == "banana") {
        newAmount = parseInt(banana) + parseInt(amount);
        cost = parseInt(bananaPrice) * parseInt(amount);
    } else if (selected == "pear") {
        newAmount = parseInt(pear) + parseInt(amount);
        cost = parseInt(pearPrice) * parseInt(amount);
    }

    newBalance = parseInt(balance) - parseInt(cost);

    if (!selected || !amount) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/accounts/buy",
                title: "Price missing",
                detail: "Price missing in request"
            }
        });
    }

    console.log(selected);
    console.log(newAmount);
    console.log(newBalance);
    console.log(email);
    db.all("UPDATE accounts SET " + selected + " = ?, balance = ? WHERE email = ?",
        newAmount,
        newBalance,
        email, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/accounts/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Account succesfully updated."
                }
            });
        }
    );
}

function sell(res, body) {
    var email = body.email;
    var balance = body.balance;
    var cost = body.cost;
    var newBalance = 0;
    var applePrice = body.applePrice;
    var orangePrice = body.orangePrice;
    var pineapplePrice = body.pineapplePrice;
    var bananaPrice = body.bananaPrice;
    var pearPrice = body.pearPrice;
    var apple = body.appleAccount;
    var orange = body.orangeAccount;
    var pineapple = body.pineappleAccount;
    var banana = body.bananaAccount;
    var pear = body.pearAccount;
    var selected = body.selected;
    var amount = body.amount;
    var newAmount = 0;

    if (selected == "apple") {
        newAmount = parseInt(apple) - parseInt(amount);
        cost = parseInt(applePrice) * parseInt(amount);
    } else if (selected == "orange") {
        newAmount = parseInt(orange) - parseInt(amount);
        cost = parseInt(orangePrice) * parseInt(amount);
    } else if (selected == "pineapple") {
        newAmount = parseInt(pineapple) - parseInt(amount);
        cost = parseInt(pineapplePrice) * parseInt(amount);
    } else if (selected == "banana") {
        newAmount = parseInt(banana) - parseInt(amount);
        cost = parseInt(bananaPrice) * parseInt(amount);
    } else if (selected == "pear") {
        newAmount = parseInt(pear) - parseInt(amount);
        cost = parseInt(pearPrice) * parseInt(amount);
    }

    newBalance = parseInt(balance) + parseInt(cost);

    if (!selected || !amount) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/accounts/sell",
                title: "Price missing",
                detail: "Price missing in request"
            }
        });
    }

    console.log(selected);
    console.log(newAmount);
    console.log(newBalance);
    console.log(email);
    db.all("UPDATE accounts SET " + selected + " = ?, balance = ? WHERE email = ?",
        newAmount,
        newBalance,
        email, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/accounts/sell",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Account succesfully updated."
                }
            });
        }
    );
}

module.exports = router;
