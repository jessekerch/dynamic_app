const router = require("express").Router();
const mongoDb = require("../models/mongo/mongoDb");

router.get("/", mongoDb.getNotes);
router.post("/", mongoDb.createNote);
router.put("/:id", mongoDb.updateNote);
router.delete("/:id", mongoDb.deleteNote);

module.exports = router;
