/**
 * @swagger
 *    components:
 *       schemas:
 *          AddProduct:
 *             type: object
 *             required:
 *                -  title
 *                -  slug
 *                -  description
 *                -  lessonCode
 *                -  authors
 *                -  publisher
 *                -  publishYear
 *                -  category
 *             properties:
 *                title:
 *                   type: string
 *                   description: The title of product
 *                slug:
 *                   type: string
 *                   description: The slug of product
 *                description:
 *                   type: string
 *                   description: The description of product
 *                lessonCode:
 *                   type: string
 *                   description: The lessonCode of product
 *                authors:
 *                   type: array
 *                   description: The authors of product
 *                publisher:
 *                   type: string
 *                   description: The publisher of product
 *                publishYear:
 *                   type: string
 *                   description: The publishYear of product
 *                category:
 *                   type: string
 *                   description: The category of product
 *                avatar:
 *                   type: string
 *                   format: binary
 *
 */

/**
 * @swagger
 *    /products:
 *       post:
 *          tags: [Products]
 *          summary: create a product
 *          requestBody:
 *             required: true
 *             content:
 *                application/x-www-form-urlencoded:
 *                   schema:
 *                      $ref: '#/components/schemas/AddProduct'
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/AddProduct'
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
