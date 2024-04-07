const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
var fetchuser = require('../middleware/fetchuser');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'omkarisagoodb$oy';

// ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required.
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password of minimum 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({success, errors: errors.array() });
    }
    // Check whether the user with same email exists already
    try {
      // check if the user already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user with same email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create's a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })//.then((user) => res.json(user));

      // Send's a token to the user using it's id.
      const data = {
        user : {
            id : user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authtoken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required.
router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password can't be blank").exists(),
    ],
    async (req, res) => {
      let success = false;
        // If there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        }

        //decripting email & password
        const {email, password} = req.body;

        //checking email and password 
        try{
            let user = await User.findOne({email});
            if(!user) {
              success = false;
              return res.status(400).json({success, error: "Please try to login with correct credeantials"});
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
              success = false;
              return res.status(400).json({success, error: "Please try to login with correct credeantials"});
            }

            // Send's a token to the user using it's id.
            const data = {
                user : {
                    id : user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({success, authtoken});

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");      
        }

    });  

// ROUTE 3: Get logged in user details using : POST "/api/auth/getuser". No login required.
    router.post("/getuser", fetchuser, async (req, res) => {
      try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
      }
    }
  );


module.exports = router;
