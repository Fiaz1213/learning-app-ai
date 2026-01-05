import express from "express";

import {
  getFlashcards,
  getAllFlashcardSets,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet,
} from "../controllers/flashcardController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

// ALl routes are protected
router.use(protect);

router.get("/:documentId", getFlashcards);
router.get("/", getAllFlashcardSets);

router.post("/:cardId/review", reviewFlashcard);
router.put("/:cardId/star", toggleStarFlashcard);

router.delete("/:id", deleteFlashcardSet);

export default router;
