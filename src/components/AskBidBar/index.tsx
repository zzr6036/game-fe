import React, { type FC } from "react";
import "./index.css";
import { convertDollar, formatFractionDigits } from "../../utils/calculate";
import { Skeleton } from "antd";

interface AskBidBarProps {
  ask: number;
  bid: number;
  isLoading?: boolean;
}

const AskBidBar: FC<AskBidBarProps> = ({ ask, bid, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <Skeleton active={isLoading} paragraph={{ width: "400px", rows: 1 }} />
      ) : (
        <div className="color-bar">
          <div
            className="green-bar"
            style={{
              width: `${5 * ((bid / (ask + bid)) * 100)}px`, // multiple 5 times for both bid and ask value for percentage bar displayß
            }}
          >{`Bid: ${
            bid < 1
              ? convertDollar(String(bid), 3)
              : !Number.isNaN(bid)
              ? formatFractionDigits(bid)
              : "-"
          }`}</div>
          <div
            className="red-bar"
            style={{
              width: `${5 * ((ask / (ask + bid)) * 100)}px`,
            }}
          >{`Ask: ${
            ask < 1
              ? convertDollar(String(ask), 3)
              : !Number.isNaN(ask)
              ? formatFractionDigits(ask)
              : "-"
          }`}</div>
        </div>
      )}
    </>
  );
};

export default AskBidBar;
