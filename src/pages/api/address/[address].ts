import { QueryResultSet, Flipside, Query } from "@flipsidecrypto/sdk/dist/src";

const getData = async (
  address: string = "0x7c36eb1ef5b94fadbd38fc35df4f3e25f724e43c"
): Promise<QueryResultSet> => {
  const flipside = new Flipside(
    `${process.env.FLIPSIDE_KEY}`,
    "https://node-api.flipsidecrypto.com"
  );
  const rawQuery = `
    select tx_hash, block_timestamp,nonce,origin_function_signature
    from optimism.core.fact_transactions
    where FROM_ADDRESS = '${address.toLowerCase()}'
    order by block_timestamp desc
    `;

  const query: Query = {
    sql: rawQuery,
    ttlMinutes: 60 * 6,
    timeoutMinutes: 60 * 6,
    cached: true,
  };

  return await flipside.query.run(query);
};

export default async function addressHandler(req: any, res: any) {
  const {
    query: { address },
    method,
  } = req;

  switch (method) {
    case "GET":
      const data = await getData(address);
      res.status(200).json(data);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
