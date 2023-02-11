import { QueryResultSet, Flipside, Query } from "@flipsidecrypto/sdk/dist/src";
import { getCompanyYearVolume } from "lib/requests/home";


export default async function addressHandler(req: any, res: any) {
  const {
    query: { company, year },
    method,
  } = req;

  switch (method) {
    case "GET":
      const data = await getCompanyYearVolume(company, +year);
      res.status(200).json(data);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
