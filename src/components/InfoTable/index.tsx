import React, { type FC } from "react";
import { Table } from "antd";
import "./index.css";

interface InfoTableProps {
  data: {
    price: string;
    size: number;
    key: number;
  }[];
  columns: {
    title: string;
    dataIndex: string;
    key: string | number;
  }[];
  isLoading?: boolean;
}

const InfoTable: FC<InfoTableProps> = ({ data, columns, isLoading }) => {
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={{
        pageSize: 10,
      }}
      loading={isLoading}
    />
  );
};

export default InfoTable;
