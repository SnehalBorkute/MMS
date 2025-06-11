const express = require("express");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user");

const router = express.Router();




// Show signup page
router.get("/signup", (req, res) => {
    res.render("signup");
});


router.post("/signup", async (req, res) => {
    const { name, email, password, mobile, year, branch } = req.body;

    // Prevent admin email from being registered
    if (email === "Admin@gmail.com") {
        return res.send("This email is reserved for admin.");
    }

    if (!email.endsWith('@gmail.com')) {
        return res.status(400).send("Only @gmail.com address are allowed");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.send("User already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        mobile,
        year,
        branch
    });

    await newUser.save();

    res.redirect("/auth/login");
});



// Show login page
// router.get("/login", (req, res) => {
//     res.render("login");
// });

// router.get("/login", (req, res) => {
//     res.render("login", { error: undefined });
// });

router.get("/login", (req, res) => {
    res.render("login", { error: undefined, query: req.query });
  });
  



router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Admin login
    if (email === "Admin@gmail.com" && password === "mess@123") {
        req.session.admin = true;
        return res.redirect("/admin/dashboard");
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.render("login", { error: " User not found! Please check your email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { error: " Incorrect password! Please try again." });
        }

        req.session.userId = user._id;
        return res.redirect("/home");
    } catch (err) {
        return res.render("login", { error: " Login failed! Please try again later." });
    }
});


// // Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login");
    });
});




// Show Reset Password form
router.get("/forgot-password", (req, res) => {
    res.render("forgotPassword", { error: null });
  });
  
  // Handle Reset Password submission
  router.post("/forgot-password", async (req, res) => {
    const { email, password, confirmPassword } = req.body;
  
    // 1. Check passwords match
    if (password !== confirmPassword) {
      return res.render("forgotPassword", { error: " Passwords do not match." });
    }
  
    // 2. Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.render("forgotPassword", { error: " Email not found!" });
    }
  
    // 3. Hash & save new password
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();
  
    // 4. Redirect to login with success message
    res.redirect("/auth/login?reset=success");
  });
  


module.exports = router;