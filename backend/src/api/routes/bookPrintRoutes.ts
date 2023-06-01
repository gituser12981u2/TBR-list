// api/routes/BookPrintRoutes.ts
import express from "express";
import * as bookPrintController from "../controllers/bookPrintController";

const router = express.Router();

router.post("/", bookPrintController.addBookPrint);
router.get("/", bookPrintController.getAllBookPrintsForUser);
router.get("/", bookPrintController.getBookPrintById);
router.put("/:id", bookPrintController.updateBookPrint);
router.delete("/:id", bookPrintController.deleteBookPrint);

export default router;
