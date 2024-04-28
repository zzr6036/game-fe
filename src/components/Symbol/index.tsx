import React, { useContext, type FC } from "react";
import { UserInfoContext } from "../../constant";
import { AppstoreFilled } from "@ant-design/icons";

const Symbol: FC = () => {
  const { symbol } = useContext(UserInfoContext);

  return (
    <div style={{ fontSize: "18px", fontWeight: 600, color: "#0a6efa" }}>
      <AppstoreFilled
        rotate={45}
        style={{
          color: "#0a6efa",
          fontSize: "20px",
          paddingRight: "8px",
        }}
      />
      {symbol}
    </div>
  );
};

export default Symbol;
