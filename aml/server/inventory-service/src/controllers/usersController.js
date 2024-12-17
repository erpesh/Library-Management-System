const User = require('../models/user');

exports.getEmailsByUserIds = async (req, res) => {
    try {
        const userIds = req.query.userIds.split(',');
        const users = await User.find({ _id: { $in: userIds } });

        const emailMap = {};
        users.forEach(user => {
            emailMap[user._id] = user.email;
        });

        res.status(200).json(emailMap);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};