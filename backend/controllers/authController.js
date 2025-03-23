import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import { nanoid } from "nanoid";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user with a hashed password and save it in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing values such as username or password
 *       409:
 *         description: User already exists, please log in
 *       500:
 *         description: Internal Server Error
 */
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Missing values such as username, password." });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists, please log in." });
    }

    // Generate a salt and hash the password
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    // Create a new user in the database
    const result = await prisma.user.create({
      data: {
        username: username,
        password: passwordHash,
      },
    });

    // Return success response after user is created
    res
      .status(201)
      .json({
        message: "User registered successfully",
        user: { id: result.id, username: result.username },
      });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user by verifying password and issue JWT and session token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT and session
 *       400:
 *         description: Missing values such as username or password
 *       404:
 *         description: No user found with that username
 *       401:
 *         description: Incorrect password
 *       500:
 *         description: Internal Server Error
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Missing values such as username, password." });
    }

    // Find the user in the database
    const fetchUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // Return error if user not found
    if (!fetchUser) {
      return res
        .status(404)
        .json({ message: "No User found with that username." });
    }

    // Compare provided password with stored hashed password
    const passwordMatch = await bcrypt.compare(password, fetchUser.password);

    // Return error if passwords don't match
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect Password." });
    }

    // Generate a JWT token with user ID as payload (1 hour expiry)
    const token = jwt.sign({ id: fetchUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Session Access Generation
    const checkSession = await prisma.session.findUnique({
      where: {
        id: `${fetchUser.id}`,
      },
    });

    let sessionUniqueValue;
    // If session exists, use the existing session value
    if (checkSession) {
      sessionUniqueValue = checkSession.value;
    } else {
      sessionUniqueValue = nanoid();
      await prisma.session.create({
        data: {
          id: `${fetchUser.id}`,
          value: sessionUniqueValue,
        },
      });
    }

    // Send successful login response with token and session value
    res
      .status(200)
      .json({
        username: fetchUser.username,
        id: fetchUser.id,
        session: sessionUniqueValue,
        token: token,
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/auth/account:
 *   get:
 *     summary: Get account details
 *     description: Retrieve the account details of the logged-in user.
 *     security:
 *       - bearerAuth: []
 *       - SessionAuth: []
 *     responses:
 *       200:
 *         description: Returns user account details
 *       401:
 *         description: Unauthorized, invalid token or session
 *       500:
 *         description: Internal Server Error
 */
export const getAccountDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      id: result.id,
      username: result.username,
      score: result.score,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
