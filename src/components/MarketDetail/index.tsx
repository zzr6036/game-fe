import React, { type FC, useMemo } from "react";
import { SymbolMarketType } from "../../api/market/typings";
import {
  calculateTotalPriceAndSize,
  sortByDollar,
} from "../../utils/calculate";
import InfoTable from "../InfoTable";
import Label from "../Label";
import AskBidBar from "../AskBidBar";

interface MarketDetailProps {
  data: SymbolMarketType;
  isLoading?: boolean;
}

const askColumns = (isAsk = true) => {
  return [
    {
      title: isAsk ? "Ask ($)" : "Bid ($)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
  ];
};

const MarketDetail: FC<MarketDetailProps> = ({ data, isLoading = false }) => {
  const { askData, bidData } = useMemo(() => {
    const ask = sortByDollar(data.asks ?? []);
    const groupedAskData = Object.keys(ask).map((key, idx) => {
      return {
        price: key,
        size: ask[key],
        key: idx + 1,
      };
    });
    const bid = sortByDollar(data.bids ?? []);
    const groupedBidData = Object.keys(bid).map((key, idx) => {
      return {
        price: key,
        size: bid[key],
        key: idx + 1,
      };
    });
    return {
      askData: groupedAskData,
      bidData: groupedBidData,
    };
  }, []);

  const { totalPrice: totalAskPrice, totalSize: totalAskSize } =
    calculateTotalPriceAndSize(data.asks ?? []);
  const { totalPrice: totalBidPrice, totalSize: totalBidSize } =
    calculateTotalPriceAndSize(data.bids ?? []);

  return (
    <div style={{ backgroundColor: "black", padding: "10px" }}>
      <Label title="Average price of Bids and average price of Asks" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <AskBidBar
          ask={data.asks.length > 0 ? totalAskPrice / data.asks.length : NaN}
          bid={data.bids.length > 0 ? totalBidPrice / data.bids.length : NaN}
          isLoading={isLoading}
        />
      </div>
      <Label title="Total trade size of Bids and total trade size of Asks" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <AskBidBar
          ask={totalAskSize}
          bid={totalBidSize}
          isLoading={isLoading}
        />
      </div>
      <Label title="Price and trade size of Bids and Asks grouped by dollar" />
      <div className="grid grid-cols-2 gap-x-24 ">
        <div>
          <InfoTable
            data={askData}
            columns={askColumns()}
            isLoading={isLoading}
          />
        </div>
        <div>
          <InfoTable
            data={bidData}
            columns={askColumns(false)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;
