import express from "express";
import { register, reVerify, verify, login, logout, forgotPassword, verifyOTP, changePassword, allUser, getUserById, updateUser } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router()

router.post("/register",register)
router.post("/verify",verify)
router.post("/reverify",reVerify)
router.post("/login",login)
router.post("/logout",isAuthenticated,logout)
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp/:email", verifyOTP)
router.post("/change-password/:email", changePassword)
router.get('/all-users',isAuthenticated,isAdmin, allUser)
router.get('/get-user',getUserById) 
router.put('/update/:id',isAuthenticated,singleUpload, updateUser)

export default router