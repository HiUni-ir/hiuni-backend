/**
 * @swagger
 *    components:
 *       schemas:
 *          UpdateProfile:
 *             type: object
 *             properties:
 *                   first_name:
 *                      type: string
 *                      description: the user first_name for update profile
 *                   last_name:
 *                      type: string
 *                      description: the user last_name for update profile
 *                   username:
 *                      type: string
 *                      description: the user username for update profile
 *                   mobile:
 *                      type: string
 *                      description: the user mobile for update profile
 *          ChangeRole:
 *             type: object
 *             required:
 *                 -  role
 *             properties:
 *                 role:
 *                    type: string
 *                    description: the role for change user role
 *          UploadAvatar:
 *              type: object
 *              required:
 *                  - avatar
 *              properties:
 *                  avatar:
 *                      type: string
 *                      format: binary
 *                      description: upload a image for user avatar
 *
 */

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

/**
 * @swagger
 *    /users/{id}:
 *       patch:
 *          tags: [Profile]
 *          summary: update user profile by ID
 *          parameters:
 *             -  in: path
 *                name: id
 *                type: string
 *                required: trie
 *          requestBody:
 *             content:
 *                application/x-www-form-urlencoded:
 *                   schema:
 *                      $ref: '#/components/schemas/UpdateProfile'
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/UpdateProfile'
 *          responses:
 *             200:
 *                description: Category updated successfully
 *             400:
 *                description: Bad Request
 *             401:
 *                description: Unauthorized
 *             500:
 *                description: Internal Server Error
 */

/**
 * @swagger
 *    /users/change-role/{id}:
 *       patch:
 *          tags: [Users]
 *          summary: change user role
 *          parameters:
 *             -  in: path
 *                name: id
 *                type: string
 *                required: trie
 *          requestBody:
 *             content:
 *                application/x-www-form-urlencoded:
 *                   schema:
 *                      $ref: '#/components/schemas/ChangeRole'
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/ChangeRole'
 *          responses:
 *             200:
 *                description: Success
 *             400:
 *                description: Bad Request
 *             401:
 *                description: Unauthorized
 *             500:
 *                description: Internal Server Error
 */

/**
 * @swagger
 *    /users/upload-avatar/{id}:
 *       patch:
 *          tags: [Profile]
 *          summary: upload user avatar
 *          parameters:
 *             -  in: path
 *                name: id
 *                type: string
 *                required: trie
 *          requestBody:
 *             content:
 *                multipart/form-data:
 *                   schema:
 *                      $ref: '#/components/schemas/UploadAvatar'
 *          responses:
 *             200:
 *                description: Success
 *             400:
 *                description: Bad Request
 *             401:
 *                description: Unauthorized
 *             500:
 *                description: Internal Server Error
 */

/**
 * @swagger
 *    /users/wishlist/{id}:
 *       patch:
 *          tags: [Profile]
 *          summary: add product to wishlist by id
 *          parameters:
 *              - in: path
 *                name: id
 *                type: string
 *                required: true
 *                description: product id
 *          responses:
 *             200:
 *                description: Success
 *             400:
 *                description: Bad Request
 *             401:
 *                description: Unauthorized
 *             500:
 *                description: Internal Server Error
 */
