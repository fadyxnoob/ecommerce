import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;
    console.log({ userName, email, password });

    //check if there is an empty input
    if (!userName || !email || !password) {
        throw new Error("Please fill all the inputs");
    }

    // check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).send("User already exists.");

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user
    const newUser = new User({ userName, email, password: hashedPassword });

    try {
        await newUser.save();
        createToken(res, newUser._id);

        res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// create a function to login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //   console.log({ email, password });
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (isPasswordValid) {
            createToken(res, existingUser._id);

            res.status(201).json({
                message: "You are loggedin",
                data: {
                    _id: existingUser._id,
                    userName: existingUser.userName,
                    email: existingUser.email,
                    isAdmin: existingUser.isAdmin,
                },
            });
            return; // exit the functon after sending the response
        }
    }
});

// create a function to logout the current user
const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logout successfully" });
});

// create function to get all the users form database
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

//create a function to get current user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            userName: user.userName,
            password: user.password,
        })
    } else {
        res.status(400)
        throw new Error("User not found.")
    }
})

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.userName = req.body.userName || user.userName
        user.email = req.body.email || user.email
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashedPassword
        }

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User not found.")
    }
})

const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        if (user.isAdmin) {
            res.status(400)
            throw new Error("Cannot delete admin user")
        }

        await User.deleteOne({ _id: user._id })
        res.json({
            message: "User Deleted"
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})


const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    console.log({user})
    if (user) {
        user.userName = req.body.userName || user.userName
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)
        console.log(user.isAdmin)
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })

    } else {
        res.status(404)
        throw new Error('User not found')
    }
})
export {
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById
};
