import React, { type FC, useContext, useEffect } from "react";
import { UserInfoContext } from "../../constant";
import MarketDetail from "../../components/MarketDetail";
import { useSymbolMarketInfo } from "../../react-query/market";
// import {
//   sumUsingReduce,
//   sumUsingGauss,
//   sumUsingRecursive,
// } from "../../utils/calculate";

const MarketPage: FC = () => {
  // useEffect(() => {
  //   test();
  // }, []);
  // const test = () => {
  //   let list = [1, 10, 100, 10000000];
  //   list.forEach((item) => {
  //     console.log(`method 1: x=${item} `, sumUsingReduce(item));
  //     console.log(`method 2: x=${item} `, sumUsingGauss(item));
  //     console.log(`method 3: x=${item} `, sumUsingRecursive(item));
  //   });
  // };
  const { symbol } = useContext(UserInfoContext);
  const { data, isLoading } = useSymbolMarketInfo(symbol);

  return <>{data && <MarketDetail data={data} isLoading={isLoading} />}</>;
};

export default MarketPage;
