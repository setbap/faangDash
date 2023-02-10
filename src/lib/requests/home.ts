import { faang } from "@prisma/client"
import prisma from "lib/requests/prisma"



export const getDayWithMaxVolume = async (company: string = "Facebook") => {
  const data: faang[] = await prisma.$queryRaw`select *, max(volume) from faang where company=${company}`;
  return data
}

export const getDayWithMinVolume = async (company: string = "Facebook") => {
  const data: faang[] = await prisma.$queryRaw`select *, min(volume) from faang where company=${company}`;
  return data
}
export const getMonthlyVolume = async (company: string = "Facebook") => {
  const data: MonthlyVolume[] = await prisma.$queryRaw`
 	SELECT
		company,
		avg(volume) as "average volume",
		min(volume) as "min volume",
		max(volume) as "max volume",
		sum(volume) as "Total Volume",
		strftime ('%Y',date) AS year,
		strftime ('%m',date) AS month,
    printf('%s-%s',strftime ('%Y',date),strftime ('%m',date)) as "yearMonth"
	from faang 
  where company=${company}
	GROUP BY
		company,
		year,
		month
	
	ORDER BY
		date,
		company`;
  return {
    data, companies: ['Facebook', 'Apple', 'Amazon', 'Netflix', 'Google'], monthlyInfoKey: [
      "max volume",
      "average volume",
      "min volume",
    ]
  }
}

interface MonthlyVolume {
  company: string;
  "average volume": number;
  "min volume": number;
  "max volume": number;
  "sum volume": number;
  year: number;
  month: number;
}