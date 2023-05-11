const Router = require("express");
const router = new Router();
const productController = require("../controllers/productController");
const { create, getList, getCurrent } = productController;
const checkMiddleware = require("../middleware/checkRoleMiddleware");

// router.post('/newProduct',checkMiddleware('ADMIN'),create)
router.post("/newProduct", create);
router.get("/getProduct", getList);
router.get("/getOne/:id", getCurrent);

module.exports = router;
