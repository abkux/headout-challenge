/**
 * @swagger
 * /check-username:
 *   post:
 *     summary: Check if the provided username is available.
 *     description: Given a username, this endpoint checks if it is available by checking the `invitee` field in the database. If the username is already taken, a message is returned indicating the same.
 *     operationId: checkUsername
 *     requestBody:
 *       description: Username to check availability.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username to check for availability.
 *                 example: johndoe123
 *             required:
 *               - username
 *     responses:
 *       '200':
 *         description: Successfully checked username availability.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: Whether the username is available or not.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: A message indicating whether the username is available or taken.
 *                   example: 'Username is available'
 *       '400':
 *         description: Bad Request. Username is missing in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Username is required'
 *       '500':
 *         description: Internal Server Error. Error occurred while checking username availability.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: 'Error checking username availability'
 */
import prisma from "../prisma/client.js";

export const checkUsername = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const count = await prisma.invite.count({
            where: {
                invitee: username
            }
        });

        return res.status(200).json({
            available: count === 0,
            message: count > 0 ? 'Username is already taken' : 'Username is available'
        });
    } catch (error) {
        console.error("Error checking username:", error);
        return res.status(500).json({
            success: false,
            message: 'Error checking username availability'
        });
    }
};
