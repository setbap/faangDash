import Company from "lib/pages/home";

import { getStaticProps as companyGetStaticProps } from "./[company]";

export async function getStaticProps() {
  const data = await companyGetStaticProps({ params: { company: "Facebook" } });
  return data;
}
export default Company;
export type CompanyType = Pick<
  Awaited<ReturnType<typeof getStaticProps>>,
  "props"
>["props"];
