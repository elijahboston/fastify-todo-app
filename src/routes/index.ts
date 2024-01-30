import {FastifyPluginAsync} from "fastify";

export const indexRouter: FastifyPluginAsync = async (app) => {
  app.get("/", (_req) => {
    return {
      message: "Hello World",
    };
  });
};
