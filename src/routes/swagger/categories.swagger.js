/**
 * @swagger
 *    components:
 *       schemas:
 *          AddCategory:
 *             type: object
 *             required:
 *                -  title
 *                -  slug
 *             properties:
 *                title:
 *                   type: string
 *                   description: The title of category
 *                slug:
 *                   type: string
 *                   description: The slug of category
 *                parent:
 *                   type: string
 *                   description: The parent ID of category
 *          EditCategory:
 *             type: object
 *             properties:
 *                title:
 *                   type: string
 *                   description: The title of category
 *                slug:
 *                   type: string
 *                   description: The slug of category
 *                parent:
 *                   type: string
 *                   description: The parent ID of category
 */

/**
 * @swagger
 *    /categories:
 *       post:
 *          tags: [Category]
 *          summary: create new category
 *          requestBody:
 *             content:
 *                application/x-www-form-urlencoded:
 *                   schema:
 *                      $ref: '#/components/schemas/AddCategory'
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/AddCategory'
 *          responses:
 *             201:
 *                description: Category created successfully
 *             400:
 *                description: Bad request
 *             401:
 *                description: Unauthorization
 *             500:
 *                description: Internal server error
 *
 */
