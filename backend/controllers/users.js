const User = require('../models/User');
const multer = require('multer');
const { Parser } = require('json2csv');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// Multer upload instance
exports.upload = multer({ storage: storage });

// @desc    Create a new user
// @route   POST /users
// @access  Public
exports.createUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, mobile, gender, status, location } = req.body;
        const profile = req.file ? `/public/uploads/${req.file.filename}` : null;

        const newUser = new User({
            firstName,
            lastName,
            email,
            mobile,
            gender,
            status,
            profile,
            location
        });

        const user = await newUser.save();
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all users with pagination
// @route   GET /users
// @access  Public
exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const startIndex = (page - 1) * limit;

        const users = await User.find().skip(startIndex).limit(limit);
        const totalUsers = await User.countDocuments();

        res.status(200).json({ 
            success: true, 
            data: users, 
            pagination: { 
                page, 
                limit, 
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers 
            } 
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get a single user
// @route   GET /users/:id
// @access  Public
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Update a user
// @route   PUT /users/:id
// @access  Public
exports.updateUser = async (req, res, next) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profile = `/public/uploads/${req.file.filename}`;
        }
        
        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete a user
// @route   DELETE /users/:id
// @access  Public
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Search for users
// @route   GET /users/search/:key
// @access  Public
exports.searchUsers = async (req, res, next) => {
    try {
        const users = await User.find({
            $or: [
                { firstName: { $regex: req.params.key, $options: 'i' } },
                { lastName: { $regex: req.params.key, $options: 'i' } },
                { email: { $regex: req.params.key, $options: 'i' } }
            ]
        });
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Export users to CSV
// @route   GET /users/export
// @access  Public
exports.exportUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        const fields = ['firstName', 'lastName', 'email', 'mobile', 'gender', 'status', 'location'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(users);

        res.header('Content-Type', 'text/csv');
        res.attachment('users.csv');
        res.send(csv);
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
