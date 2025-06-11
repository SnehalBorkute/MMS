
const Attendance = require("../models/attendanceModel");
const User = require("../models/user");

// Show Today's Absentees
// exports.viewTodayAttendance = async (req, res) => {
//     try {
//         const now = new Date();
//         const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
//         const tomorrow = new Date(today);
//         tomorrow.setUTCDate(today.getUTCDate() + 1);

//         const absenteesRaw = await Attendance.find({
//             date: { $gte: today, $lt: tomorrow },
//             status: "Absent"
//         });

//         const absentees = await Promise.all(absenteesRaw.map(async (record) => {
//             const user = await User.findById(record.userId);
//             return {
//                 _id: record._id,
//                 date: record.date,
//                 status: record.status,
//                 userId: {
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email
//                 }
//             };
//         }));

//         res.render("adminAttendanceToday", { absentees });
//     } catch (err) {
//         console.error(" Error fetching attendance:", err.message);
//         res.status(500).send("Error fetching attendance");
//     }
// };

exports.viewTodayAttendance = async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1);

        const absenteesRaw = await Attendance.find({
            date: { $gte: today, $lt: tomorrow },
            status: "Absent"
        });

        const absentees = await Promise.all(absenteesRaw.map(async (record) => {
            const user = await User.findById(record.userId);

            if (!user) {
                return null; // Skip if user not found
            }

            return {
                _id: record._id,
                date: record.date,
                status: record.status,
                userId: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        }));

        // Filter out any nulls (from deleted users)
        const filteredAbsentees = absentees.filter(a => a !== null);

        res.render("adminAttendanceToday", { absentees: filteredAbsentees });
    } catch (err) {
        console.error(" Error fetching attendance:", err.message);
        res.status(500).send("Error fetching attendance");
    }
};

//  Show Absence History for One Student
exports.viewStudentHistory = async (req, res) => {
    try {
        const userId = req.params.id;
        const history = await Attendance.find({ userId, status: "Absent" }).sort({ date: -1 });
        const user = await User.findById(userId);
        res.render("adminUserHistory", { history, user });
    } catch (err) {
        console.error(" Error fetching student history:", err.message);
        res.status(500).send("Error fetching student history");
    }
};
