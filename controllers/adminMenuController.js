




const Menu = require("../models/menu"); // Update the path as per your structure

// GET /admin/menu => Render the full menu management page
const renderMenuPage = async (req, res) => {
    try {
        const menuList = await Menu.find();
        res.render("admin_menu", { menuList});
    } catch (error) {
        console.error("Error loading menu page:", error);
        res.status(500).send("Error loading menu page");
    }
};

// POST /admin/menu/add => Add a new menu item
const addMenu = async (req, res) => {
    try {
        const { date, day, type, items } = req.body;

        const newMenu = new Menu({
            date,
            day,
            type,
            items: Array.isArray(items) ? items : [items],
        });

        await newMenu.save();
        res.redirect("/admin/menu");
    } catch (error) {
        console.error("Error adding menu:", error);
        res.status(500).send("Internal Server Error");
    }
};

// GET /admin/menu/delete/:id => Delete a menu item
const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;
        await Menu.findByIdAndDelete(id);
        res.redirect("/admin/menu");
    } catch (error) {
        console.error("Error deleting menu:", error);
        res.status(500).send("Internal Server Error");
    }
};

// GET /admin/menu/edit/:id => Render the edit form
const renderEditPage = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        res.render("admin_editMenu", { menu }); // You must have an `editMenu.ejs`
    } catch (error) {
        console.error("Error loading edit page:", error);
        res.status(500).send("Internal Server Error");
    }
};

// POST /admin/menu/edit/:id => Update a menu item
const updateMenu = async (req, res) => {
    try {
        const { date, day, type, items } = req.body;

        await Menu.findByIdAndUpdate(req.params.id, {
            date,
            day,
            type,
            items: Array.isArray(items) ? items : [items],
        });

        res.redirect("/admin/menu");
    } catch (error) {
        console.error("Error updating menu:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Export all
module.exports = {
    renderMenuPage,
    addMenu,
    deleteMenu,
    renderEditPage,
    updateMenu,

};



