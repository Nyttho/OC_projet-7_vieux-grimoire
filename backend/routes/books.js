const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/bestrating", bookCtrl.getBestRating);
router.post("/", auth, multer, multer.resizeImage, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.createRating);
router.put("/:id", auth, multer, multer.resizeImage, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
