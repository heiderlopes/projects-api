const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos (HTML, CSS, JS) da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

// Mock Database
let projects = [
  {
    id: 1,
    name: "Startup Sustentável",
    description: "Projetos ecológicos",
  },
  {
    id: 2,
    name: "ONG Educação",
    description: "Aulas para comunidades",
  },
  {
    id: 3,
    name: "Inovação Social",
    description: "Tecnologia para impacto",
  },
  {
    id: 4,
    name: "Refloresta Futuro",
    description: "Ações de plantio e preservação ambiental",
  },
  {
    id: 5,
    name: "Conexão Solidária",
    description: "Apoio a famílias em situação de vulnerabilidade",
  },
  {
    id: 6,
    name: "Tech para Todos",
    description: "Inclusão digital e cursos gratuitos de tecnologia",
  },
  {
    id: 7,
    name: "Oceanos Limpos",
    description: "Limpeza de praias e educação ambiental",
  },
  {
    id: 8,
    name: "Mentoria Jovem",
    description: "Desenvolvimento profissional para jovens",
  },
  {
    id: 9,
    name: "Horta Comunitária Viva",
    description: "Produção colaborativa de alimentos orgânicos",
  },
  {
    id: 10,
    name: "Proteção Animal Brasil",
    description: "Resgate e cuidados para animais abandonados",
  },
];

let userProjects = {}; // { userId: [projectIds] }

// ROTAS -----------------------------------------------------

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lista todos os projetos
 *     responses:
 *       200:
 *         description: Lista de projetos
 */
app.get("/projects", (req, res) => {
  res.json(projects);
});

/**
 * @swagger
 * /projects/{id}/join:
 *   post:
 *     summary: Inscreve um usuário em um projeto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inscrição realizada
 */

app.post("/projects/:id/join", (req, res) => {
  const projectId = parseInt(req.params.id);
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });

  // Registra participação
  if (!userProjects[userId]) userProjects[userId] = [];

  if (!projects.find((p) => p.id === projectId))
    return res.status(404).json({ error: "Projeto não encontrado" });

  if (!userProjects[userId].includes(projectId))
    userProjects[userId].push(projectId);

  res.json({ message: "Inscrição realizada com sucesso!" });
});

/**
 * @swagger
 * /users/{id}/projects:
 *   get:
 *     summary: Lista projetos em que o usuário está inscrito
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de projetos
 */
app.get("/users/:id/projects", (req, res) => {
  const userId = req.params.id;

  const projectIds = userProjects[userId] || [];
  const subscribedProjects = projects.filter((p) => projectIds.includes(p.id));

  res.json(subscribedProjects);
});

// SWAGGER ---------------------------------------------------

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// SERVER ----------------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📖 Swagger: http://localhost:${PORT}/docs`);
});
