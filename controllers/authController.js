const User = require('../models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');
const userprofile=require('../model/userProfile');

const ADMIN_EMAIL = 'Admin@gmail.com';
const ADMIN_PASSWORD = 'mess@123';

// exports.signup = async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.send('User already exists');
        
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ name, email, password: hashedPassword });
//         await newUser.save();
//         res.redirect('/auth/login');
//     } catch (err) {
//         res.status(500).send('Error in signup');
//     }
// };
exports.signup = async (req, res) => {
    const { name, email, password, mobile, year, branch } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.send('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile,
            year,
            branch
        });

        await newUser.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).send('Error in signup');
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        req.session.user = { email, role: 'admin' };
        return res.redirect('/admin/dashboard');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.send('User not found');

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.send('Incorrect password');

        req.session.user = { id: user._id, email: user.email, role: 'user' };
        res.redirect('/user/dashboard');
    } catch (err) {
        res.status(500).send('Login error');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
