const express = require("express");
const router = express.Router();

const User = require("./../model/User");

// Password handler
const bcrypt = require("bcrypt");

//register
router.post("/register", (req, res) => {
    let { firstname, lastname, email, password, confirmpassword } = req.body;
    firstname = firstname;
    lastname = lastname;
    email = email;
    password = password;
    confirmpassword = confirmpassword;

    if (firstname == "" || lastname == ""|| email == "" || password == "" || confirmpassword == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!",
        });
    } else if (!/^[a-zA-Z ]*$/.test(firstname)) {
        res.json({
            status: "FAILED",
            message: "Invalid firstname  entered",
        });
    }
        else if (!/^[a-zA-Z ]*$/.test(lastname)) {
            res.json({
                status: "FAILED",
                message: "Invalid lastname  entered",
            });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered",
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!",
        });
    } else if (password !== confirmpassword) {
        res.json({
            status: "FAILED",
            message: "sec password must be same!",
        });
    } else {
        // Checking if user already exists
        User.find({ email })
            .then((result) => {
                if (result.length) {
                    // A user already exists
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists",
                    });
                } else {
                    // Try to create new user
                    // password handling
                    const saltRounds = 10;
                    bcrypt
                        .hash(password, saltRounds)
                        .then((hashedPassword) => {
                            const newUser = new User({
                                firstname,
                                lastname,
                                email,
                                password: hashedPassword,
                            });

                            newUser
                                .save()
                                .then((result) => {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Signup successful",
                                        data: result,
                                    });
                                })
                                .catch((err) => {
                                    res.json({
                                        status: "FAILED",
                                        message: "An error occurred while saving user account!",
                                    });
                                });
                        })
                        .catch((err) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while hashing password!",
                            });
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user!",
                });
            });
    }
});

// login
router.post("/login", (req, res) => {
    let { email, password } = req.body;
    email = email;
    password = password;

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied",
        });
    } else {
        // Check if user exist
        User.find({ email })
            .then((data) => {
                if (data.length) {
                    // User exists

                    const hashedPassword = data[0].password;
                    bcrypt
                        .compare(password, hashedPassword)
                        .then((result) => {
                            if (result) {
                                // Password match
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signin successful",
                                    data: data,
                                });
                            } else {
                                res.json({
                                    status: "FAILED",
                                    message: "Invalid password entered!",
                                });
                            }
                        })
                        .catch((err) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while comparing passwords",
                            });
                        });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials entered!",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user",
                });
            });
    }
});



module.exports = router;