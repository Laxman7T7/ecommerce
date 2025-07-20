import "reflect-metadata"
import express from "express"
import { AppDataSource } from "./data-source"
import productRoutes from "./routes/product.routes"
import path from "path"
import cors from "cors"
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use("/api/products",productRoutes);
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully")

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err)
  })
