import express from "express"
import { logout, signin, signup } from "../controllers/auth.controllers.js"

const authRouter=express.Router()

authRouter.post("/signup",signup)
authRouter.post("/signIn",signin)
authRouter.get("/logout",logout)

export default authRouter