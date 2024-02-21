import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  ZFundInputSchema,
  ZRoundCreateInputSchema,
  ZRoundUpdateInputSchema,
} from "./round.schemas";
import {
  TransferType,
  createCheckout,
  createTransferGroup,
} from "~/server/stripe";

export async function getRound(id: string, db: PrismaClient) {
  return db.round.findFirst({ where: { id } });
}

export const roundRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => getRound(input.id, ctx.db)),

  list: publicProcedure.query(({ ctx }) => ctx.db.round.findMany({})),
  balance: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const round = await getRound(input.id, ctx.db);
      const stripeAccount = round?.stripeAccount;
      if (!stripeAccount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Round must have a connected Stripe account",
        });
      }

      return ctx.stripe.charges
        .list(
          {
            limit: 100,
            // List all transfers to the round and sum them
            transfer_group: createTransferGroup(input.id),
          },
          { stripeAccount },
        )
        .then((r) => {
          console.log(r.data[0]);
          const currency = r.data?.[0]?.currency;
          const amount = r.data.reduce((sum, x) => sum + x.amount, 0);
          return { amount, currency };
        });
    }),
  // .then(sumTransfers)),

  create: protectedProcedure
    .input(ZRoundCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.round.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: ZRoundUpdateInputSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const round = await getRound(input.id, ctx.db);

      if (userId !== round?.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be owner of round to update",
        });
      }

      return ctx.db.round.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  fund: protectedProcedure
    .input(ZFundInputSchema)
    .mutation(async ({ ctx, input }) => {
      const round = await getRound(input.id, ctx.db);
      if (!round) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Round not found" });
      }
      if (!round.stripeAccount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Round must have a connected Stripe account",
        });
      }

      return createCheckout(
        {
          successUrl: input.successUrl,
          metadata: {
            userId: ctx.user.id,
            type: TransferType.round,
          },
          transferGroup: createTransferGroup(input.id),
          stripeAccount: round.stripeAccount,
          lineItems: [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                product_data: {
                  name: String(round.name),
                  description: String(round.description),
                },
                unit_amount: input.amount * 100,
              },
            },
          ],
        },
        ctx.stripe,
      );
    }),
});
