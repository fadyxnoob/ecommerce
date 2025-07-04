import express from "express";
import {
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById
} from "../controller/user.controller.js";

import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
    .route("/")
    .post(createUser)
    .get(authenticate, authorizeAdmin, getAllUsers);
router
    .route("/auth")
    .post(loginUser);
router
    .route("/logout")
    .post(logoutCurrentUser);
router
    .route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile)

// admin routes
router
    .route('/:id')
    .delete(authenticate, authorizeAdmin, deleteUserById)
    .get(authenticate, authorizeAdmin, getUserById)
    .put(authenticate, authorizeAdmin, updateUserById)



export default router;
