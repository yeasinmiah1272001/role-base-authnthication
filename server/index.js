const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  Timestamp,
} = require("mongodb");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 8000;

// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log(token);
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qlvqjvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("airBnb").collection("users");

    // auth related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });
    // Logout
    app.get("/logout", async (req, res) => {
      try {
        res
          .clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
        console.log("Logout successful");
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // get all user
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // saved user from database
    app.put("/user", async (req, res) => {
      const user = req.body;
      // console.log("user", user);
      const query = { email: user.email };
      // console.log("quer", query);
      const isExist = await userCollection.findOne(query);
      if (isExist) {
        if (user?.status === "Requested") {
          const result = await userCollection.updateOne(query, {
            $set: { status: user?.status },
          });
          res.send(result);
        } else {
          return res.send(isExist);
        }
      } else {
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            ...user,
            timestamp: Date.now(),
          },
        };
        const result = await userCollection.updateOne(
          query,
          updatedDoc,
          options
        );
        // console.log("up re", result);
        res.send(result);
      }
    });

    // get user email by db
    app.get("/user/:email", async (req, res) => {
      const user = req.body;
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from StayVista Server..");
});

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`);
});
