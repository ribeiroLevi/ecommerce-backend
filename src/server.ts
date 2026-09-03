import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { userRoutes } from "./routes/user-routes.js";
import { authRoutes } from "./routes/auth-routes.js";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Eccomerce",
      version: "0.0.2",
    },
  },
  transform: jsonSchemaTransform,
});

//rota de documentação da API
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.get("/", () => {
  return "Hello World!";
});

app.register(userRoutes);
app.register(authRoutes);

app.ready().then(() => {
  console.log(JSON.stringify(app.swagger(), null, 2));
});

//porta da API
app.listen({ port: 3333 }).then(() => {
  console.log("Servidor rodando!");
});
