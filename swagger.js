const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Talentos & Projetos",
      version: "1.0.0",
      description: "API para conectar talentos a projetos de impacto",
    },
  },
  apis: ["./index.js"],
};

// Documentação usando comentários JSDoc
module.exports = swaggerJsdoc({
  ...options,
  apis: ["./index.js"],
});
