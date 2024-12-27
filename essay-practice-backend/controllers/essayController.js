import essayService from '../services/essayService.js';  // Using ES Module import
import db from '../models/index.js';  // Assuming db is used for interacting with the database

// Function to handle saving the essay
const saveEssay = async (req, res) => {
  const { exam, essayText, userId } = req.body;

  // Validate the input
  if (!exam || !essayText || !userId) {
    return res.status(400).json({ message: 'Exam, essayText, and userId are required' });
  }

  try {
    // Call service to save the essay
    const savedEssay = await essayService.saveEssayToDatabase(exam, essayText, userId);
    res.status(201).json(savedEssay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving essay', error: error.message });
  }
};

// Function to handle essay evaluation
const evaluateEssay = async (req, res) => {
  const { exam, essayText, userId } = req.body;

  // Validate the input
  if (!exam || !essayText || !userId) {
    return res.status(400).json({ message: 'Exam, essayText, and userId are required' });
  }

  try {
    // Call service to evaluate the essay
    const evaluationResult = await essayService.evaluateEssayWithGemini(exam, essayText);

    // Save the result to the database (optional)
    await essayService.saveEvaluationResultToDatabase(userId, evaluationResult);

    res.status(200).json(evaluationResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error evaluating essay', error: error.message });
  }
};

// Function to fetch all saved essays by a user (optional)
const getEssaysByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch essays from the database for the given userId
    const essays = await db.Essay.findAll({ where: { userId } });

    if (!essays.length) {
      return res.status(404).json({ message: 'No essays found for this user' });
    }

    res.status(200).json(essays);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching essays', error: error.message });
  }
};

// Function to fetch a specific essay by ID
const getEssayById = async (req, res) => {
  const { essayId } = req.params;

  try {
    // Fetch essay from the database for the given essayId
    const essay = await db.Essay.findOne({ where: { id: essayId } });

    if (!essay) {
      return res.status(404).json({ message: 'Essay not found' });
    }

    res.status(200).json(essay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching essay', error: error.message });
  }
};

// Exporting functions using ES Module syntax
export { saveEssay, evaluateEssay, getEssaysByUser, getEssayById };
