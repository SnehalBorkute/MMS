
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/user");

// Ensure authenticated
router.use((req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/auth/login");
    }
    next();
});

// Setup multer for profile pic uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Show profile
router.get("/profile", async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render("profile", { user });
});

// Show the Edit Profile page
router.get("/edit", async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("editProfile", { user });
});


// Update profile info
router.post("/profile/update", async (req, res) => {
    const { name, mobile, year, branch } = req.body;
    await User.findByIdAndUpdate(req.session.userId, { name, mobile, year, branch });
    res.redirect("/user/profile");
});

// Upload profile pic
router.post("/profile/upload", upload.single("profilePicture"), async (req, res) => {
  const profilePath = "/uploads/" + req.file.filename;
  await User.findByIdAndUpdate(req.session.userId, { profilePicture: profilePath });
  res.redirect("/user/profile");
});


// Upload profile pic
router.post("/profile/upload", upload.single("profilePicture"), async (req, res) => {
    const profilePath = "/uploads/" + req.file.filename;
    await User.findByIdAndUpdate(req.session.userId, { profilePicture: profilePath });
    res.redirect("/user/profile");
});

module.exports = router;

