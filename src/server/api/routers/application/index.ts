import type { PrismaClient } from "@prisma/client";

import {
  type CreateContextOptions,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  ZApplicationApproveSchema,
  ZApplicationCreateSchema,
  ZApplicationListSchema,
} from "./application.schemas";
import { getGrant } from "../grant";
import { TRPCError } from "@trpc/server";
import { getRound } from "../round";
import { sendGrantAppliesToRoundEmail } from "../../emails";

export async function getApplication(id: string, db: PrismaClient) {
  return db.application.findFirst({ where: { id } });
}

export async function verifyRoundOwnership(
  id: string,
  ctx: CreateContextOptions,
) {
  const userId = ctx.user?.id;
  const round = await getRound(id, ctx.db);

  if (round?.userId !== userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      // message: "Must be the owner of the resource",
    });
  }
}

export async function verifyGrantOwnership(
  id: string,
  ctx: CreateContextOptions,
) {
  const userId = ctx.user?.id;
  const grant = await getGrant(id, ctx.db);

  if (grant?.userId !== userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      // message: "Must be the owner of the resource",
    });
  }
}

export const applicationRouter = createTRPCRouter({
  list: protectedProcedure
    .input(ZApplicationListSchema)
    .query(async ({ ctx, input: { roundId } }) => {
      await verifyRoundOwnership(roundId, ctx);

      return ctx.db.application.findMany({
        where: { roundId },
        include: { grant: true },
      });
    }),

  create: protectedProcedure
    .input(ZApplicationCreateSchema)
    .mutation(async ({ ctx, input: { grantId, roundId } }) => {
      await verifyGrantOwnership(grantId, ctx);

      sendGrantAppliesToRoundEmail({ grantId, roundId }).catch(console.log);

      return ctx.db.application.create({
        data: { grantId, roundId, userId: ctx.user.id },
      });
    }),

  approve: protectedProcedure
    .input(ZApplicationApproveSchema)
    .mutation(async ({ ctx, input: { ids, roundId } }) => {
      await verifyRoundOwnership(roundId, ctx);

      return ctx.db.application.updateMany({
        where: { roundId, id: { in: ids } },
        data: { approvedById: ctx.user.id },
      });
    }),
});
