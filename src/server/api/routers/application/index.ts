import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

import {
  type CreateContextOptions,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  ZApplicationCreateSchema,
  ZApplicationListSchema,
} from "./application.schemas";
import { getGrant } from "../grant";
import { TRPCError } from "@trpc/server";

export async function getApplication(id: string, db: PrismaClient) {
  return db.application.findFirst({ where: { id } });
}

async function verifyRoundOwnership(id: string, ctx: CreateContextOptions) {
  const userId = ctx.user?.id;
  if (!(await ctx.db.round.findFirst({ where: { id, userId } }))) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Must be the owner of the resource",
    });
  }
}

export const applicationRouter = createTRPCRouter({
  list: publicProcedure
    .input(ZApplicationListSchema)
    .query(async ({ ctx, input: { roundId } }) => {
      await verifyRoundOwnership(roundId, ctx);

      return ctx.db.application.findMany({
        where: { roundId },
        include: {
          grant: true,
        },
      });
    }),

  create: protectedProcedure
    .input(ZApplicationCreateSchema)
    .mutation(async ({ ctx, input: { grantId, roundId } }) => {
      const grant = await getGrant(grantId, ctx.db);

      const userId = ctx.user.id;
      if (grant?.userId !== userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db.application.create({
        data: { grantId, roundId, userId: userId },
      });
    }),
});
