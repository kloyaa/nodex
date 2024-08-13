import { Router } from 'express';
import { login, register, changeUserPassword } from '../controllers/auth.controller';
import { isAuthenticated } from '../_core/middlewares/jwt.middleware';

const router = Router();
const commonMiddlewares = [isAuthenticated];

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   headers:
 *     NodexUserOrigin:
 *       description: Origin of the request
 *       schema:
 *         type: string
 *         example: mobile
 *       default: mobile
 *     NodexAccessKey:
 *       description: Access key for authentication
 *       schema:
 *         type: string
 *         example: v7pb6wylg4m0xf0kx5zzoved
 *       default: v7pb6wylg4m0xf0kx5zzoved
 *     NodexSecretKey:
 *       description: Secret key for authentication
 *       schema:
 *         type: string
 *         example: glrvdwi46mq00fg1oqtdx3rg
 *       default: glrvdwi46mq00fg1oqtdx3rg
 *   schemas:
 *     login:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: kolya003
 *         password:
 *           type: string
 *           example: Password@01
 *       required:
 *         - username
 *         - password
 *       example:
 *         username: kolya003
 *         password: Password@01
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 * /api/auth/v1/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Login a user with username and password.
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Bad Request - Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     parameters:
 *       - in: header
 *         name: nodex-user-origin
 *         description: Origin of the request
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexUserOrigin'
 *       - in: header
 *         name: nodex-access-key
 *         description: Access key for authentication
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexAccessKey'
 *       - in: header
 *         name: nodex-secret-key
 *         description: Secret key for authentication
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexSecretKey'
 */
router.post('/auth/v1/login', login as any);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 * /api/auth/v1/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User registration
 *     description: Register a new user with email, username, and password.
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'kolya003@gmail.com'
 *               username:
 *                 type: string
 *                 example: 'kolya003'
 *               password:
 *                 type: string
 *                 example: 'Password@123'
 *             required:
 *               - email
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Bad Request - Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       401:
 *         description: Conflict - User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     parameters:
 *       - in: header
 *         name: nodex-user-origin
 *         description: Origin of the request
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexUserOrigin'
 *       - in: header
 *         name: nodex-access-key
 *         description: Access key for authentication
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexAccessKey'
 *       - in: header
 *         name: nodex-secret-key
 *         description: Secret key for authentication
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexSecretKey'
 */
router.post('/auth/v1/register', register as any);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 * /api/auth/v1/account/change-password:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Auth
 *     summary: Change user password
 *     description: Change the current password of the user to a new password.
 *     requestBody:
 *       description: Password change details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: 'Password@123'
 *               newPassword:
 *                 type: string
 *                 example: 'Password@01'
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password change successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Bad Request - Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       401:
 *         description: Unauthorized - Invalid credentials or token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     parameters:
 *       - in: header
 *         name: nodex-user-origin
 *         description: Origin of the request
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexUserOrigin'
 *       - in: header
 *         name: nodex-access-key
 *         description: Access key for authentication
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexAccessKey'
 *       - in: header
 *         name: nodex-secret-key
 *         description: Secret key for authentication
 *         required: true
 *         schema:
 *           $ref: '#/components/headers/NodexSecretKey'
 */
router.post('/auth/v1/account/change-password', commonMiddlewares, changeUserPassword as any);

export default router;
