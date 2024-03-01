const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("../api/models/user");
const Post = require("../api/models/post");

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect("mongodb+srv://nguyenhoainama3k55:1234@cluster0.lso4ppl.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error Connecting to MongoDB", err);
    });

// Start the server
app.listen(port, () => {
    console.log("Server is running on port 3000");
});

// Models

// Send verification email
const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "nguyenhoainama3k55@gmail.com",
            pass: "rmjv hmqh slth rhrh",
        },
    });
    const mailOptions = {
        from: "threads.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email http://192.168.1.204:3000/verify/${verificationToken}`,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error sending email", error);
    }
};

// Register a new user
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newUser = new User({ name, email, password });
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        await newUser.save();

        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.log("Error registering user", error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Verify email
app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log("Error getting token", error);
        res.status(500).json({ message: "Email verification failed" });
    }
});

// Generate secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString("hex");
};

const secretKey = generateSecretKey();

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email" });
        }

        if (user.password !== password) {
            return res.status(404).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey);
        res.status(200).json({ token });
    } catch (error) {
        console.log("Login failed", error);
        res.status(500).json({ message: "Login failed" });
    }
});

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log("Error getting the users", error);
        res.status(500).json({ message: "Error getting the users" });
    }
});

// Follow a user
app.post("/follow", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { followers: currentUserId },
        });

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error following a user" });
    }
});

// Unfollow a user
app.post("/unfollow", async (req, res) => {
    const { loggedInUserId, targetUserId } = req.body;

    try {
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: loggedInUserId },
        });

        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user" });
    }
});

// Create a new post
app.post("/create-post", async (req, res) => {
    try {
        const { content, userId } = req.body;

        const newPostData = {
            user: userId,
        };

        if (content) {
            newPostData.content = content;
        }

        const newPost = new Post(newPostData);

        await newPost.save();

        res.status(200).json({ message: "Post saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Post creation failed" });
    }
});

// Like a post
app.put("/posts/:postId/:userId/like", async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        const post = await Post.findById(postId).populate("user", "name");

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: userId } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        updatedPost.user = post.user;

        res.json(updatedPost);
    } catch (error) {
        console.error("Error liking post:", error);
        res
            .status(500)
            .json({ message: "An error occurred while liking the post" });
    }
});

// Unlike a post
app.put("/posts/:postId/:userId/unlike", async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        const post = await Post.findById(postId).populate("user", "name");

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { likes: userId } },
            { new: true }
        );

        updatedPost.user = post.user;

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error("Error unliking post:", error);
        res
            .status(500)
            .json({ message: "An error occurred while unliking the post" });
    }
});

// Get all posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res
            .status(500)
            .json({ message: "An error occurred while getting the posts" });
    }
});

// Get user profile
app.get("/profile/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error while getting the profile" });
    }
});

// Update user description
app.put("/profile/:userId/description", async (req, res) => {
    try {
        const { userId } = req.params;
        const { description } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                description: description,
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res
            .status(200)
            .json({ message: "User description updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user description" });
    }
});
