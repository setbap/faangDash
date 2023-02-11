import { faang, Prisma, PrismaClient } from "@prisma/client"
import prisma from "lib/requests/prisma"



export const getDayWithMaxVolume = async (company: string = "Facebook") => {
  const data: faang[] = await prisma.$queryRaw`select *, max(volume) from faang where company=${company}`;
  return data
}

export const getDayWithMinVolume = async (company: string = "Facebook") => {
  const data: faang[] = await prisma.$queryRaw`select *, min(volume) from faang where company=${company}`;
  return data
}

export async function getCompanyYearVolume(company: string = "Facebook", year: number = 2016, prismaC: PrismaClient = prisma): Promise<YearlyStockVolume> {
  const q1 = `
  SELECT
		date,volume
	FROM
		faang
	where company='${company}' and strftime('%Y',date) ='${year}'
  `
  const data: { date: string, volume: number }[] = await prismaC.$queryRawUnsafe(q1);

  const q2 = `
    SELECT
 		min(volume) min,MAX(volume) max
 	FROM
 		faang
 	where company='${company}' and strftime('%Y',date) ='${year}'
  `
  const minmax: { min: number, number: number }[] = await prismaC.$queryRawUnsafe(q2)


  return { data, year, minmax: minmax[0] };
}

export const getYearRange = async (company: string = "Facebook") => {
  const data: { year: number }[] = await prisma.$queryRaw`
  SELECT
  	distinct strftime('%Y',date) as year
  FROM
  	faang	
  where 
  	company=${company}
  `;
  return data;
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


export interface YearlyStockVolume {
  data: {
    date: string;
    volume: number;
  }[];
  year: number;
  minmax: {
    min: number;
    number: number;
  };
}