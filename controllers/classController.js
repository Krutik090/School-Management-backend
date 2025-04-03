const Class = require('../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
    try {
        const { name, section, classTeacher } = req.body;

        // Check if the class name already exists
        const existingClass = await Class.findOne({ name });
        if (existingClass) {
            return res.status(400).json({ message: "Class name already exists" });
        }

        // Create new class
        const newClass = new Class({ name, section, classTeacher });
        await newClass.save();

        res.status(201).json({ message: "Class created successfully", class: newClass });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .populate({
                path: 'classTeacher',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'name email role' // Select only required fields from User
                }
            });

        res.status(200).json({
            success: true,
            classes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getClassById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find class by ID and populate classTeacher and user details
        const classDetails = await Class.findById(id)
            .populate({
                path: 'classTeacher',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'name email role' // Select only required fields from User
                }
            });

        if (!classDetails) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            class: classDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, section, classTeacher } = req.body;

        // Find and update the class
        const updatedClass = await Class.findByIdAndUpdate(
            id,
            { name, section, classTeacher },
            { new: true, runValidators: true } // Return updated document and validate input
        ).populate({
            path: 'classTeacher',
            populate: {
                path: 'user',
                model: 'User',
                select: 'name email role'
            }
        });

        if (!updatedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Class updated successfully",
            class: updatedClass
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the class
        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Class deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};