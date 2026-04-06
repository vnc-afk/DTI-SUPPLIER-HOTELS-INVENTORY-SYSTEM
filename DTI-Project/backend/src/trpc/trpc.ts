import { initTRPC } from '@trpc/server';

export type Context = Record<string, never>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;
export const createTRPCContext = (): Context => ({});
