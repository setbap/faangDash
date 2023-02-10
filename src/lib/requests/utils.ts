import { ReturnDataType } from "lib/types/base";
import moment from "moment";

export const getSimpleInfo = async <T>(
  velocityKey: string,
  title: string
): Promise<ReturnDataType<T>> => {
  const res = await fetch(
    `https://node-api.flipsidecrypto.com/api/v2/queries/${velocityKey}/data/latest`
  );
  const data: T = (await res.json())[0];
  return { data, title, key: velocityKey };
};

export const getSimpleOutSourceData = async <T>(link: string) => {
  const fetchedData = await fetch(link);
  const parsedData: T = await fetchedData.json();
  return parsedData;
};

export const getSimpleArrayData = async <T, R = null>(
  velocityKey: string,
  title: string,
  sortKey: keyof T | null = null,
  mapFn: ((item: T) => R) | null = null
): Promise<ReturnDataType<T[] | R[]>> => {
  const res = await fetch(
    `https://node-api.flipsidecrypto.com/api/v2/queries/${velocityKey}/data/latest`
  );
  let fetchedData: T[] = await res.json();
  if (sortKey !== null) {
    fetchedData = fetchedData.sort((a, b) =>
      // @ts-ignore
      moment(a[sortKey]).isAfter(moment(b[sortKey])) ? 1 : -1
    );
  }
  if (mapFn !== null) {
    return {
      data: fetchedData.map(mapFn),
      title,
      key: velocityKey,
    };
  }

  return {
    data: fetchedData,
    title,
    key: velocityKey,
  };
};

export function pivotData<T extends { [key: string]: any }>(
  rawData: T[],
  xAxisKey2: keyof T,
  nameKey: keyof T,
  valueKey: keyof T,
  bridges: string[],
  minValue: number = 0,
  isDate: boolean = false
) {
  const dailyEachBridgeSum: any = {};
  rawData.forEach((item) => {
    const xAxisKey = isDate
      ? moment(item[xAxisKey2]).format("MM/DD/YYYY")
      : item[xAxisKey2];
    if (!Boolean(item[valueKey]) || item[valueKey] < minValue) {
    } else if (dailyEachBridgeSum[xAxisKey] === undefined) {
      dailyEachBridgeSum[xAxisKey] = {};
      dailyEachBridgeSum[xAxisKey][item[nameKey]] = item[valueKey];
    } else if (dailyEachBridgeSum[xAxisKey][item[nameKey]] === undefined) {
      dailyEachBridgeSum[xAxisKey][item[nameKey]] = item[valueKey];
    } else {
      dailyEachBridgeSum[xAxisKey][item[nameKey]] += item[valueKey];
    }
  });
  const dailyBridgeValue = Object.entries(dailyEachBridgeSum).map((bc) => {
    const finalObject = { Name: bc[0] };
    bridges.forEach((bridge) => {
      // @ts-ignore
      if (bc[1][bridge]) {
        // @ts-ignore
        finalObject[bridge] = bc[1][bridge];
      }
    });
    return finalObject;
  });

  return dailyBridgeValue;
}

export function summerizeRow<T extends { [key: string]: any }>(
  data: T[],
  nameKey: keyof T,
  valueKey: keyof T
) {
  const keyValueData: { [key: string]: number } = {};
  data
    .map((item) => ({
      [nameKey]: item[nameKey],
      [valueKey]: item[valueKey],
    }))
    .forEach((row: any) => {
      keyValueData[row[nameKey]] =
        (!keyValueData[row[nameKey]] ? 0 : keyValueData[row[nameKey]]) +
        row[valueKey];
    });
  // @ts-ignore
  const x2: { nameKey: string; valueKey: number }[] = Object.entries(
    keyValueData
  ).map((t) => ({
    [nameKey]: t[0],
    [valueKey]: t[1],
  }));
  return x2;
}

export function summerizeRow2Item<T extends { [key: string]: any }>(
  data: T[],
  nameKey: keyof T,
  valueKey1: keyof T,
  valueKey2: keyof T,
  isDate: boolean = false
) {
  const keyValue1Data: { [key: string]: number } = {};
  const keyValue2Data: { [key: string]: number } = {};
  data
    .map((item) => ({
      [nameKey]: isDate
        ? moment(item[nameKey]).format("MM/DD/YYYY")
        : item[nameKey],
      [valueKey1]: item[valueKey1],
      [valueKey2]: item[valueKey2],
    }))
    .forEach((row: any) => {
      keyValue1Data[row[nameKey]] =
        (!keyValue1Data[row[nameKey]] ? 0 : keyValue1Data[row[nameKey]]) +
        row[valueKey1];

      keyValue2Data[row[nameKey]] =
        (!keyValue2Data[row[nameKey]] ? 0 : keyValue2Data[row[nameKey]]) +
        row[valueKey2];
    });
  const data2 = Object.entries(keyValue2Data);
  // @ts-ignore
  const x2: { nameKey: string; valueKey: number }[] = Object.entries(
    keyValue1Data
  ).map((t, index) => ({
    [nameKey]: t[0],
    [valueKey1]: t[1],
    [valueKey2]: data2[index][1],
  }));
  return x2;
}

/*
function for complex data with pivot

export const getMostPopularTokenSwapCount: () => Promise<any> = async () => {
  const res = await fetch(
    "https://node-api.flipsidecrypto.com/api/v2/queries/90429960-c3a4-46a0-aa10-be315d0e7362/data/latest"
  );
  const rawData: IMostPoularTokenSwapCountOnRef[] = await res.json();
  const actionType = Array.from(
    new Set(
      rawData.map((item) => {
        return item.type;
      })
    )
  );
  const countInfo = pivotData(
    rawData,
    "Symbol",
    "type",
    "Count",
    actionType,
    0
  );
  return {
    countInfo: countInfo.sort((a, b) =>
      // @ts-ignore
      a[actionType[0]] > b[actionType[0]] ? -1 : 1
    ),
    actions: actionType,
  };
};

*/

/*
change name to reducae conflict
export const getSwapToStablecoinsToOthers: () => Promise<ISankeyChartBase> =
  async () => {
    const res = await fetch(
      "https://node-api.flipsidecrypto.com/api/v2/queries/e2441a8e-19e1-4ebf-aca7-961e1e3023cd/data/latest"
    );
    const fetchedData: IStablecoinSwap[] = await res.json();
    const fromCoins = fetchedData.map((item) => item["Swap from"]);
    const toCoins = fetchedData.map((item) => item["Swap to"] + " ");
    const nodesSet = new Set(fromCoins.concat(toCoins));
    const nodes = Array.from(nodesSet);
    const links = fetchedData.map((item) => ({
      source: item["Swap from"],
      target: item["Swap to"] + " ",
      value: item["Volume USD"],
    }));
    return {
      nodes,
      links,
    };
  };

*/
