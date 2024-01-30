import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";
import {todos} from "./routes/todos";
import {indexRouter} from "routes";

const app = fastify({
  ajv: {
    customOptions: {
      removeAdditional: "all",
      coerceTypes: true,
      useDefaults: true,
    },
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
}).withTypeProvider<TypeBoxTypeProvider>();

// setup fastify
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "SampleApi",
      description: "Sample backend service",
      version: "1.0.0",
    },
    servers: [],
  },
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.register(indexRouter);
app.register(todos, {prefix: "/api/todos"});

async function run() {
  await app.ready();

  await app.listen({
    port: 3000,
  });

  console.log("Documentation running at http://localhost:3000/docs");
}

run();
