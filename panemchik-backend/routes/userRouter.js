const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const { login, check, registration, getUsers } = userController;
const authMiddleware = require("../middleware/authMiddleware");
const checkMiddleware = require("../middleware/checkRoleMiddleware");
const { refresh, access, test } = require("../controllers/tokenController");
//route from api/user/**
router.post("/registration", registration);
router.post("/login", login);
router.get("/auth", authMiddleware, check);
router.get("/refresh", refresh);
router.get("/access", access);
router.get("/allusers", getUsers);
router.post("/test", test);

module.exports = router;
