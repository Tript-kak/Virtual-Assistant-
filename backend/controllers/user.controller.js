import User from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import gemniResponse from "../gemini.js"
import moment from "moment"


const cleanForSpeech = (text = "") => {
    return text
        .replace(/[*_~`#]/g, "")      
        .replace(/\n+/g, ". ")        
        .replace(/\s{2,}/g, " ")
        .trim()
}

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: "get current user" })
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body
        let assistantImage
        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path)
        } else {
            assistantImage = imageUrl
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { assistantName, assistantImage },
            { new: true }
        ).select("-password")

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "update assistant error" })
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body
        if (!command || !command.trim()) {
            return res.status(400).json({ response: "I didn't catch that. Could you say it again?" })
        }

        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(400).json({ response: "I couldn't find your account." })
        }

        const userName = user.name
        const assistantName = user.assistantName

        const result = await gemniResponse(command, assistantName, userName)

        const jsonMatch = result.match(/{[\s\S]*}/)
        if (!jsonMatch) {
            return res.status(400).json({ response: "Sorry, I didn't understand that. Could you try again?" })
        }

        const gemResult = JSON.parse(jsonMatch[0])
        const type = gemResult.type

        const speak = (text) => cleanForSpeech(text)

        switch (type) {
            case "get_date":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: speak(`Today is ${moment().format("MMMM Do")}`),
                })

            case "get_day":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: speak(`It's ${moment().format("dddd")}`),
                })

            case "get_month":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: speak(`It's ${moment().format("MMMM")}`),
                })

            case "get_time":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: speak(`It's ${moment().format("h:mm A")}`),
                })

            case "google_search":
            case "youtube_search":
            case "youtube_play":
            case "general":
            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
            case "weather_show":
            case "spotify_open":
            case "gmail_open":
            case "maps_open":
            case "website_open":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: speak(gemResult.response),
                })

            default:
                return res.status(400).json({ response: "Sorry, I didn't understand that. Could you try again?" })
        }
    } catch (error) {
        console.error("Ask Assistant Error:", error)
        return res.status(500).json({
            response: "Something went wrong on my end. Please try again.",
        })
    }
}