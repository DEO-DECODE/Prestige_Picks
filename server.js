import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import fileUpload from "express-fileupload";
//configure env
dotenv.config({ path: "config.env" });

//databse config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));
/*
fileUpload is a middleware provided by the express-fileupload library, which is commonly used for handling file uploads in Express.js.
*/
/*
When useTempFiles is set to true, the uploaded files are saved to a temporary directory on the server, and the req.files object (which contains information about the uploaded files) will include references to these temporary files.
*/
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(`Server Running  on port ${PORT}`.bgCyan.white);
});
