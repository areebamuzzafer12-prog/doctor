import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        console.log(atoken)
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const decoded = jwt.verify(atoken, process.env.JWT_SECRET)
        req.body.adminId = decoded.id
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;