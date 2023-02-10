import Company from "lib/pages/home";
import {
  getDayWithMaxVolume,
  getDayWithMinVolume,
  getMonthlyVolume,
} from "lib/requests/home";
import {
  getDayWithHighestDrop,
  getDayWithHighestDropInPercentage,
  getDayWithHighestGrowth,
  getDayWithHighestGrowthInPercentage,
  getMonthlyCandleInfo,
} from "lib/requests/price-change";

export async function getStaticPaths() {
  return {
    paths: ["Facebook", "Apple", "Amazon", "Netflix", "Google"].map((item) => ({
      params: { company: item.toLowerCase() },
    })),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { company: string };
}) {
  const company =
    params.company.charAt(0).toLocaleUpperCase() +
    params.company.slice(1).toLowerCase();

  const [
    dayWithMaxVolume,
    dayWithMinVolume,
    monthlyVolume,
    dayWithHighestDrop,
    dayWithHighestDropInPercentage,
    dayWithHighestGrowth,
    dayWithHighestGrowthInPercentage,
    monthlyCandleInfo,
  ] = await Promise.all([
    getDayWithMaxVolume(company),
    getDayWithMinVolume(company),
    getMonthlyVolume(company),
    getDayWithHighestDrop(company),
    getDayWithHighestDropInPercentage(company),
    getDayWithHighestGrowth(company),
    getDayWithHighestGrowthInPercentage(company),
    getMonthlyCandleInfo(company),
  ]);
  return {
    props: {
      data: {
        dayWithMaxVolume,
        dayWithMinVolume,
        monthlyVolume,
        dayWithHighestDrop,
        dayWithHighestDropInPercentage,
        dayWithHighestGrowth,
        dayWithHighestGrowthInPercentage,
        monthlyCandleInfo,
      },
      company: company,
    },
    revalidate: 10 * 60,
  };
}
export default Company;
export type CompanyType = Pick<
  Awaited<ReturnType<typeof getStaticProps>>,
  "props"
>["props"];
