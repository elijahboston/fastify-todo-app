import {FastifyPluginAsync} from "fastify";
import {getDb} from "../db";
import {Type} from "@sinclair/typebox";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";

const todoSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  completed: Type.Boolean(),
});

export const todos: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<TypeBoxTypeProvider>()
    .get(
      "/",
      {
        schema: {
          response: {
            200: Type.Object({
              todos: Type.Array(todoSchema),
            }),
          },
        },
      },
      (_req) => {
        const db = getDb();
        const todos = db.all();
        return todos;
      }
    )
    .get(
      "/:id",
      {
        schema: {
          params: Type.Object({
            id: Type.String(),
          }),
          response: {
            200: todoSchema,
          },
        },
      },
      (req, _reply) => {
        const db = getDb();
        return db.read(req.params.id);
      }
    )
    .post(
      "/",
      {
        schema: {
          body: Type.Object({
            title: Type.String(),
          }),
          response: {
            200: todoSchema,
          },
        },
      },
      (req) => {
        const db = getDb();
        return db.create(req.body.title);
      }
    )
    .post(
      "/:id",
      {
        schema: {
          params: Type.Object({
            id: Type.String(),
          }),
          body: Type.Object({
            title: Type.Optional(Type.String()),
            completed: Type.Optional(Type.Boolean()),
          }),
          response: {
            200: todoSchema,
          },
        },
      },
      (req) => {
        const db = getDb();
        const original = db.read(req.params.id);
        return db.update(req.params.id, {
          ...original,
          ...req.body,
        });
      }
    );
};
