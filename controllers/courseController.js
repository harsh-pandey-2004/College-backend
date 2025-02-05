const Course = require('../models/courseModel');

const courseController = {
  bulkUploadCourses: async (req, res) => {
    try {
      const { courses } = req.body;

      if (!Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of courses'
        });
      }

      const validationErrors = [];
      courses.forEach((course, index) => {
        if (!course.instituteName || !course.courseName || !course.fee) {
          validationErrors.push(`Course at index ${index} is missing required fields`);
        }
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: validationErrors
        });
      }

      const insertedCourses = await Course.insertMany(courses);

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${insertedCourses.length} courses`,
        courses: insertedCourses
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error uploading courses',
        error: error.message
      });
    }
  }
  ,

  getCourses: async (req, res) => {
    try {
      const { query, state, city, stream, level, maxFee, page = 1, limit = 10 } = req.query;

      const searchQuery = {};
      if (query) searchQuery.courseName = { $regex: query, $options: 'i' };
      if (state) searchQuery.instituteState = { $regex: state, $options: 'i' };
      if (city) searchQuery.instituteCity = { $regex: city, $options: 'i' };
      if (stream) searchQuery.courseStream = { $regex: stream, $options: 'i' };
      if (level) searchQuery.level = level;
      if (maxFee) searchQuery.fee = { $lte: parseInt(maxFee) };

      const courses = await Course.find(searchQuery)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .sort({ createdAt: -1 });

      const count = await Course.countDocuments(searchQuery);

      res.json({
        success: true,
        courses,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCourses: count
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching courses',
        error: error.message
      });
    }
  }
  ,
  getCollege: async (req, res) => {
    try {
      const colleges = await Course.find();
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  }

};

module.exports = courseController;