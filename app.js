const express = require("express");
const path = require("path");
const session = require("express-session");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const multer = require('multer'); 

// Import Routes
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes=require("./routes/feedbackRoutes");
const adminFeedbackRoutes = require("./routes/adminFeedbackRoutes");
const paymentRoutes=require("./routes/paymentRoutes");
const adminMenuRoutes = require("./routes/adminMenuRoutes");
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/user');
const adminAttendanceRoutes = require('./routes/adminAttendanceRoutes');
const adminBudgetRoutes = require("./routes/adminBudgetRoutes");
const userBudgetRoutes = require("./routes/userBudgetRoutes");

// Import Middleware
const { isAdmin, isUser } = require("./middlewares/auth");





const app = express();

//  Connect to MongoDB
connectDB();

//  Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Session Configuration
app.use(
    session({
  secret: "supersecretkey", // Change this to a strong secret key
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1-day session expiry
    })
);

// Set View Engine & Static Folder
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//  Routes
app.use("/auth", authRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/admin", adminRoutes); 
app.use("/admin/menu", adminMenuRoutes);
app.use("/feedback",feedbackRoutes);
app.use("/admin/feedback", adminFeedbackRoutes);
app.use("/admin", require("./routes/adminRoutes"));
app.use('/user', menuRoutes);
app.use('/payment', paymentRoutes);
app.use('/user', userRoutes);
app.use("/admin", adminBudgetRoutes);
app.use('/admin-attendance', adminAttendanceRoutes);
app.use("/user", userBudgetRoutes);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/admin/dashboard", isAdmin, (req, res) => {
    res.render("admindashboard");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});
app.get("/index", (req, res) => {
    res.render("index");
});




//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

