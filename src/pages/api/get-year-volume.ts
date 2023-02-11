

import {faangData} from '../../lib/utility/faang'

const getCorrectTypeData = ():{ date: string,year:number,company:string, volume: number }[] => {
  return faangData.map(row => ({company:row.company,date:row.date,year:new Date(row.date).getFullYear() ,volume:row.volume}))
}
const fullData = getCorrectTypeData();

function getCompanyYearVolume(company: string = "Facebook", year: number = 2016):{
  data : { date: string, volume: number }[],
  year:number
} {
  return ({
    data : fullData.filter(row => row.year == year && company == row.company),
    year
  })
}

export default async function addressHandler(req: any, res: any) {
  
  const {
    query: { company, year },
    method,
  } = req;


  switch (method) {
    case "GET":

      const data = getCompanyYearVolume(company, +year);
      res.status(200).json(data);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
