/**
 * @swagger
 *    /users/@me:
 *       get:
 *          tags: [Profile]
 *          summary: get logged in user
 *          responses:
 *             200:
 *                description: Success
 *             401:
 *                description: Unauthorized
 *             500:
 *                description: Internal server error
 */

/**
 * @swagger
 *    /users:
 *       get:
 *          tags: [Users]
 *          summary: get users list
 *          parameters:
 *             - in: query
 *               name: search
 *               type: string
 *             - in: query
 *               name: page
 *               type: string
 *             - in: query
 *               name: limit
 *               type: string
 *          responses:
 *             200:
 *                description: Success
 *             401:
 *                description: Unauthorized
 *             403:
 *                description: Forbidden
 *             500:
 *                description: Internal server error
 */
