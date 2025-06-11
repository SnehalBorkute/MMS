
const Attendance = require("../models/attendanceModel");


// Mark Absence (Only for Current Date)
exports.markAbsence = async (req, res) => {
    const userId = req.session.userId; // Get user ID from session
    if (!userId) {
        return res.status(401).send("Unauthorized: Please log in.");
    }


    const now = new Date();

     // Time restriction: only allow between 12:00 AM and 8:00 AM
     const currentHour = now.getHours();
     if (currentHour >= 8) {
        return res.render("attendance", {
            user: req.session.user,
            records: [],
            message: "You can mark absence only between 12 AM to 8 AM.",
            totalDaysInMonth: null,
            absentDays: null,
            presentDays: null,
            totalPayment: null,
            deductionApplied: false
        });
     }
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));


    try {
        // Check if already marked
        const existingRecord = await Attendance.findOne({ userId, date: today });
        if (existingRecord) {
            return res.render("attendance", {
                user: req.session.user,
                records: [],
                message: "Already marked absence",
                totalDaysInMonth: null,
                absentDays: null,
                presentDays: null,
                totalPayment: null,
                deductionApplied: false
            });
        }

        // Save absence
        const newAttendance = new Attendance({
            userId,
            date: today,
            status: "Absent"
        });

        await newAttendance.save();
        res.redirect("/attendance"); // Redirect after marking
    } catch (err) {
        console.error("Error marking absence:", err.message);
        res.status(500).send("Error marking absence.");
    }
};



exports.getAbsences = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect("/auth/login");
    }

    try {
        const records = await Attendance.find({ userId, status: "Absent" }).sort({ date: 1 });

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
        const monthStart = new Date(Date.UTC(year, month, 1));
        const monthEnd = new Date(Date.UTC(year, month, totalDaysInMonth, 23, 59, 59));

        const monthlyAbsences = await Attendance.find({
            userId,
            date: { $gte: monthStart, $lte: monthEnd },
            status: "Absent"
        }).sort({ date: 1 });

        const absentDates = monthlyAbsences.map(a => a.date);

        //  Check for continuous 5+ absences
        let maxStreak = 1;
        let currentStreak = 1;
        for (let i = 1; i < absentDates.length; i++) {
            const diff = (absentDates[i] - absentDates[i - 1]) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }

        const absentDays = monthlyAbsences.length;
        const presentDays = totalDaysInMonth - absentDays;

        let totalPayment = 1900;
        if (maxStreak >= 1) {
            totalPayment = presentDays * 63;
        }

        res.render("attendance", {
            user: req.session.user,
            records,
            message: null,
            presentDays,
            absentDays,
            totalDaysInMonth,
            totalPayment,
            deductionApplied: maxStreak >= 5
        });

    } catch (err) {
        console.error("Error fetching attendance records:", err.message);
        res.status(500).send("Error fetching attendance records.");
    }
};

// //  Fetch Absence Records
// exports.getAbsences = async (req, res) => {
//     const userId = req.session.userId;
//     if (!userId) {
//         return res.redirect("/auth/login");
//     }

//     try {
//         const records = await Attendance.find({ userId, status: "Absent" }).sort({ date: 1 });
//         // res.render("attendance", { records }); ***
//         // Pass the message as null or a custom message
//         res.render("attendance", { user: req.session.user, records, message: null }); 
//     } catch (err) {
//         console.error("Error fetching attendance records:", err.message);
//         res.status(500).send("Error fetching attendance records.");
//     }
// };



  