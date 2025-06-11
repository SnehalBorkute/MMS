// controllers/menuController.js
const Menu = require('../models/menu');  // Adjust the path according to your project structure

// Function to fetch menu data
exports.getMenuForUser = async (req, res) => {
    try {
        // Fetch the latest menu (sorted by date)
        const menuList = await Menu.find().sort({ date: -1 });

        // Send the menu data to the user dashboard view
        res.render('menu', { menuList });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
