import React, { FC, ReactNode } from "react";
import "./index.css";

interface LabelProps {
  title: string | ReactNode;
}
const Label: FC<LabelProps> = ({ title }) => {
  return (
    <div className="item">
      <div className="bullet" />
      <div className="title">{title}</div>
    </div>
  );
};

export default Label;
