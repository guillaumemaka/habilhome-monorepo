import { makeFunctionInvoker } from 'awilix-koa';

function makeBenchmarkApi({ statsService }) {
  return {
    getStats: async (ctx) => {
      const data = await statsService.getStats();
      ctx.ok({ data });
    },
  };
}

export default function (router) {
  if (process.env.NODE_ENV !== 'production') {
    const api = makeFunctionInvoker(makeBenchmarkApi);
    router.get('/api/benchmark', api('getStats'));
  }
}
