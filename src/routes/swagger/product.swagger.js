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
 *                file:
 *                   type: string
 *                   format: binary
 *          EditProduct:
 *             type: object
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
 *                file:
 *                   type: string
 *                   format: binary
 */

/**
 * @swagger
 *    /products:
 *       post:
 *          tags: [Products]
 *          summary: create new product
 *          requestBody:
 *             content:
 *                multipart/form-data:
 *                   schema:
 *                      $ref: '#/components/schemas/AddProduct'
 *          responses:
 *             201:
 *                description: Product created successfully
 *             400:
 *                description: Bad request
 *             401:
 *                description: Unauthorization
 *             500:
 *                description: Internal server error
 *
 */

/**
 * @swagger
 *    /products/{id}:
 *       patch:
 *          tags: [Products]
 *          summary: update a product by id
 *          parameters:
 *             - in: path
 *               name: id
 *               type: string
 *               required: true
 *          requestBody:
 *             content:
 *                multipart/form-data:
 *                   schema:
 *                      $ref: '#/components/schemas/EditProduct'
 *          responses:
 *             200:
 *                description: Product updated successfully
 *             400:
 *                description: Bad request
 *             401:
 *                description: Unauthorization
 *             500:
 *                description: Internal server error
 *
 */

/**
 * @swagger
 *    /products:
 *       get:
 *          tags: [Products]
 *          summary: get product list
 *          parameters:
 *              - in: query
 *                name: search
 *                type: string
 *              - in: query
 *                name: page
 *                type: string
 *              - in: query
 *                name: limit
 *                type: string
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
 *    /products/{id}:
 *       get:
 *          tags: [Products]
 *          summary: get one product by id
 *          parameters:
 *              - in: path
 *                name: id
 *                type: string
 *                required: true
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
