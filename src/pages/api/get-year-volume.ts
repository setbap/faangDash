
import { PrismaClient } from "@prisma/client";
import { getCompanyYearVolume } from "lib/requests/home";



export default async function addressHandler(req: any, res: any) {
  const prisma = new PrismaClient();
  const {
    query: { company, year },
    method,
  } = req;


  switch (method) {
    case "GET":

      const data = await getCompanyYearVolume(company, +year, prisma);
      res.status(200).json(data);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
