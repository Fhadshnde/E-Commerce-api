const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const productRoute = require("./routes/product");
const cartRoute = ("./routes/cart");
const cors = require("cors");
app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000",  
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization"
};

app.use(cors(corsOptions));
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // مهلة الاتصال بقاعدة البيانات
  })
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.log("DB Connection Error: ", err);
  });

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}!`);
});
