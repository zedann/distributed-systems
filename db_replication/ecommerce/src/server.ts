import express from "express";

import productRoutes from "./presentation/http/routes/productRoutes";
import orderRoutes from "./presentation/http/routes/orderRoutes";

const app = express();

app.use(express.json());

app.use("/api", productRoutes);
app.use("/api", orderRoutes);

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
