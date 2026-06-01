import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NODE_ENV, CLIENT_URL, PORT } from "../secret";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat Application API",
      version: "1.0.0",
      description: "Professional chat application REST API with authentication, messaging, and real-time features",
      contact: {
        name: "API Support",
        email: "support@chatapp.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            avatar: { type: "string" },
            name: { type: "string" },
          },
        },
        Chat: {
          type: "object",
          properties: {
            id: { type: "string" },
            participants: { type: "array", items: { $ref: "#/components/schemas/User" } },
            type: { type: "string", enum: ["private", "group"] },
            name: { type: "string" },
            avatar: { type: "string" },
            lastMessage: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Message: {
          type: "object",
          properties: {
            id: { type: "string" },
            chatId: { type: "string" },
            sender: { $ref: "#/components/schemas/User" },
            content: { type: "string" },
            type: { type: "string", enum: ["text", "image", "file", "audio"] },
            fileUrl: { type: "string" },
            isPinned: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", default: false },
            statusCode: { type: "integer" },
            message: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: express.Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em }
    `,
    customSiteTitle: "Chat API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }));

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  if (NODE_ENV === "development") {
    console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  }
};

export default setupSwagger;