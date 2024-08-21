const router = require("express").Router();
const pgDb = require("../models/pg/pgDb");

router.get("/", pgDb.getNotes);
router.post("/", pgDb.createNote);
router.put("/:id", pgDb.updateNote);
router.delete("/:id", pgDb.deleteNote);

module.exports = router;
