import jwt from 'jsonwebtoken';
import prisma from "../prisma/client.js";

// authentication middleware to verify user token and session
const authMiddleware = async (req, res, next) => {
    try {
        // get the token and session from request headers
        let token = req.header("Authorization");
        const session = req.header("Session");
        
        // if no token is provided, deny access
        if (!token) {
            return res.status(403).json({ error: "Access Denied" });
        }

        // if the token starts with "Bearer ", remove the prefix to verify
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // Verify the token using the secret key from environment variable (.env)
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verify;
        
        const userId = req.user.id;

        // fetch the session value stored in the database for the given user
        const sessionValue = await prisma.session.findUnique({
            where: {
                id: `${userId}`
            }
        })

        // if the session from the header does not match the one in the database, deny access
        if (session !== sessionValue.value) {
            return res.status(403).json({ error: "Access Denied, Invalid Session" });
        }

        // if everything is ok, proceed with the next route
        next();
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export default authMiddleware;
