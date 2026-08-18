import { Router } from "express";

import { ProductController } from "../controllers/ProductController";

const router = Router();

router.post("/products", ProductController.create);

router.get("/products", ProductController.getAll);

router.get("/products/:id", ProductController.getById);

export default router;
