import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"

export const signup = async (req,res)=>{
    try {
        const {name,email,password} = req.body

        const existEmail = await User.findOne({email})

        if(existEmail){
            return res.status(400).json({message:"Email Already Exists"})
        }

        if(password.length < 6){
            return res.status(400).json({message:"password must be of atleast 6 characters"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user=await User.create({
            name,
            password:hashedPassword,
            email
        })

    const token = await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:false
    })

    return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message:`sign up error`})
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body

        // check if user exists
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        // generate token
        const token = await genToken(user._id)

        // set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(200).json(user)

    } catch (error) {
        console.log("Signin Error:", error)
        return res.status(500).json({
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        // clear token cookie
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),   // immediately expire cookie
            sameSite: "strict",
            secure: false
        })

        return res.status(200).json({
            message: "Logged out successfully"
        })

    } catch (error) {
        console.log("Logout Error:", error)
        return res.status(500).json({
            message: error.message
        })
    }
}