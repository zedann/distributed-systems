"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const router = (0, express_1.Router)();
router.post("/products", ProductController_1.ProductController.create);
router.get("/products", ProductController_1.ProductController.getAll);
exports.default = router;
