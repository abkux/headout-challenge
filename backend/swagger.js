
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'The Globetrotter Challenge API',
      version: '1.0.0',
      description: 'API documentation for The Globetrotter Challenge operations',
    },
    servers: [
      {
        url: 'https://headout-challenge.onrender.com/api',
        description: 'OnRender',
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
  },
  apis: ['./routes/*.js'], // Points to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs available at /api-docs');
};

export default swaggerDocs;
