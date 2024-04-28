import React, { useEffect, type FC, useState, useContext } from "react";
import { Typography, Button, Col, Row } from "antd";
import { UserInfoContext } from "../../constant";
import { LOGIN_INFO } from "../../constant";
import "./index.css";
import { webSocketBaseUrl } from "../../utils/urls";

interface DataItem {
  price: number;
  size: number;
  time: number;
}

const WebSocketDashboard: FC = () => {
  const [ws, setWs] = useState<WebSocket>();
  const [subscribe, setSubscribeTopic] = useState(false);
  const [isOnline, setOnline] = useState(false);
  const [askData, setAskData] = useState<DataItem[]>([]);
  const [bidData, setBidData] = useState<DataItem[]>([]);
  const [averageAskPerMin, setAverageAskPerMin] = useState(0);
  const [averageBidPerMin, setAverageBidPerMin] = useState(0);
  const [totalAskSizePerMin, setTotalAskSizePerMin] = useState(0);
  const [totalBidSizePerMin, setTotalBidSizePerMin] = useState(0);

  const { token, symbol } = useContext(UserInfoContext);

  useEffect(() => {
    computeAverageAsk();
  }, [askData]);

  useEffect(() => {
    computeAverageBid();
  }, [bidData]);

  const setSubscribe = (subscribeTopic: boolean) => {
    setSubscribeTopic(subscribeTopic);
  };

  const establishConnection = () => {
    if (!ws || ws.readyState !== ws.OPEN) {
      const newWs = new WebSocket(webSocketBaseUrl(token));
      newWs.onopen = () => {
        setOnline(true);
        if (subscribe) {
          setTimeout(() => {
            sendMessage(subscribe);
          }, 3000);
        }
      };

      newWs.onmessage = (event) => {
        let jsonData = JSON.parse(event.data);
        if (jsonData && jsonData.code == 401) {
          console.log("Received message:", event.data);
          console.log("real time data token expired! Logging out");
          // refresh token post api -> /api/v1/kucoin-token
        } else if (jsonData?.topic === `/market/level2:${symbol}`) {
          let data = jsonData.data;
          let changes = data.changes;
          if (changes.asks.length > 1) {
            let price = parseFloat(changes.asks[0][0]);
            let size = parseFloat(changes.asks[0][1]);
            if (price <= 0 || size <= 0) return;
            let time = data.time;
            setAskData((prevArr) => [
              { price: price, size: size, time: time },
              ...prevArr,
            ]);
          }
          if (changes.bids.length > 1) {
            let price = parseFloat(changes.bids[0][0]);
            let size = parseFloat(changes.bids[0][1]);
            let time = parseInt(data.time);
            if (price <= 0 || size <= 0) return;
            setBidData((prevArr) => [
              { price: price, size: size, time: time },
              ...prevArr,
            ]);
          }
        } else {
          console.log("Received message:", event.data);
        }
      };
      newWs.onclose = () => {
        console.log("WebSocket connection closed");
        setOnline(false);
        setSubscribe(false);
        const info = localStorage.getItem(LOGIN_INFO);

        if (info != null) {
          setTimeout(() => {
            establishConnection();
          }, 2000);
        }
      };

      newWs.onerror = (error) => {
        console.error("WebSocket error:", error);
        setOnline(false);
        setSubscribe(false);
      };

      setWs(newWs);
      return newWs;
    }
  };

  const computeAverageBid = () => {
    const currentTime = new Date().getTime();
    const oneMinuteAgo = currentTime - 60 * 1000;
    let totalBidSize = 0.0;
    let totalBidPrice = 0.0;
    let totalPriceSize = 0;
    let indexToRemove = -1;
    for (let i = 0; i < bidData.length; ++i) {
      if (bidData[i].time >= oneMinuteAgo) {
        totalBidSize += bidData[i].size;
        totalBidPrice += bidData[i].price;
        totalPriceSize += 1.0;
      } else {
        indexToRemove = i;
        break;
      }
    }

    setTotalBidSizePerMin(totalBidSize);

    if (totalPriceSize > 0) {
      setAverageBidPerMin(totalBidPrice / totalPriceSize);
    }
    if (indexToRemove > 0) {
      setBidData([...bidData.slice(0, indexToRemove)]);
    }
  };

  const computeAverageAsk = () => {
    const currentTime = new Date().getTime();
    const oneMinuteAgo = currentTime - 60 * 1000;

    let totalAskSize = 0.0;
    let totalAskPrice = 0.0;
    let totalPriceSize = 0;
    let indexToRemove = -1;
    for (let i = 0; i < askData.length; ++i) {
      if (askData[i].time >= oneMinuteAgo) {
        totalAskSize += askData[i].size;
        totalAskPrice += askData[i].price;
        totalPriceSize += 1;
      } else {
        indexToRemove = i;
        break;
      }
    }
    setTotalAskSizePerMin(totalAskSize);
    if (totalPriceSize > 0) {
      setAverageAskPerMin(totalAskPrice / totalPriceSize);
    }
    if (indexToRemove > 0) {
      setAskData([...askData.slice(0, indexToRemove)]);
    }
  };

  useEffect(() => {
    establishConnection();
  }, []);

  const sendMessage = (isSubscribeTopic: boolean) => {
    // Example message
    /**
        {
            "type": "unsubscribe",
            "topic": "/market/level2:BTC-USDT",
            "privateChannel": false
        }
        {
            "type": "subscribe",
            "topic": "/market/level2:BTC-USDT",
            "privateChannel": false
        }
         */

    if (ws && ws.readyState === ws.OPEN) {
      const message = {
        type: isSubscribeTopic ? "subscribe" : "unsubscribe",
        topic: `/market/level2:${symbol}`,
        privateChannel: false,
      };
      setSubscribe(isSubscribeTopic);
      ws.send(JSON.stringify(message));
    } else {
      setSubscribe(false);
    }
  };

  const renderAsk = () => {
    let renderItems = [];
    let total = 0;
    for (let i = 0; i < 30 && i < askData.length; ++i) {
      total += askData[i].size;
    }
    for (let i = 0; i < 30 && i < askData.length; ++i) {
      let percentageTrade = 100 * (askData[i].size / total);
      percentageTrade *= 5;
      percentageTrade = Math.min(percentageTrade, 100);
      renderItems.push(
        <Row
          key={"ask_row_" + i}
          style={{
            background: `linear-gradient(90deg, rgb(160, 26, 12) ${percentageTrade}%, #000000 0%)`,
          }}
        >
          <Col className="ask-data-price" span={12}>
            {askData[i].price.toFixed(4)}
          </Col>
          <Col className="ask-data-size" span={12}>
            {askData[i].size}
          </Col>
        </Row>
      );
    }
    return renderItems;
  };

  const renderBid = () => {
    let renderItems = [];
    let total = 0;
    for (let i = 0; i < 30 && i < bidData.length; ++i) {
      total += bidData[i].size;
    }
    for (let i = 0; i < 30 && i < bidData.length; ++i) {
      let percentageTrade = 100 * (bidData[i].size / total);
      percentageTrade *= 5;
      percentageTrade = Math.min(percentageTrade, 100);
      renderItems.push(
        <Row
          key={"bid_row_" + i}
          style={{
            background: `linear-gradient(270deg, rgb(0, 179, 80) ${percentageTrade}%, #000000 0%)`,
          }}
        >
          <Col className="bid-data-size" span={12}>
            {bidData[i].size}
          </Col>
          <Col className="bid-data-price" span={12}>
            {bidData[i].price.toFixed(4)}
          </Col>
        </Row>
      );
    }
    return renderItems;
  };

  return (
    <div className="real-time-body">
      <Typography.Title level={5}>WebSocket Client</Typography.Title>
      <div>
        <div>
          <span>
            <Button disabled={isOnline} onClick={() => establishConnection()}>
              {isOnline ? "Online" : "Connect"}
            </Button>
          </span>
          <div
            className={
              "online-indicator" +
              (isOnline ? " online-color" : " offline-color")
            }
          >
            <span
              className={
                "blink" + (isOnline ? " online-color" : " offline-color")
              }
            ></span>
          </div>
        </div>
        <Button
          disabled={!isOnline}
          className="subBtn"
          onClick={() => sendMessage(!subscribe)}
        >
          {subscribe ? "Unsubscribe" : "Subscribe"} {symbol}
        </Button>
        <Row className="legend-row">
          <Col span={8}>Total Trade/min({symbol.split("-")[0]})</Col>
          <Col style={{ textAlign: "center" }} span={8}>
            Average Price/min({symbol.split("-")[1]})
          </Col>
          <Col style={{ textAlign: "right" }} span={8}>
            Total Trade/min({symbol.split("-")[0]})
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={12} className="bid-data-size">
                {totalBidSizePerMin.toFixed(4)}
              </Col>
              <Col span={12} className="bid-data-price">
                {averageBidPerMin.toFixed(4)}
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={12} className="ask-data-price">
                {averageAskPerMin.toFixed(4)}
              </Col>
              <Col span={12} className="ask-data-size">
                {totalAskSizePerMin.toFixed(4)}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="legend-row">
          <Col span={8}>Total({symbol.split("-")[0]})</Col>
          <Col style={{ textAlign: "center" }} span={8}>
            Price({symbol.split("-")[1]})
          </Col>
          <Col style={{ textAlign: "right" }} span={8}>
            Total({symbol.split("-")[0]})
          </Col>
        </Row>

        <Row className="real-time-row">
          <Col span={12}>{bidData && renderBid()}</Col>
          <Col span={12}>{askData && renderAsk()}</Col>
        </Row>
      </div>
    </div>
  );
};

export default WebSocketDashboard;
