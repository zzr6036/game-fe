import React, { FC, useCallback, useMemo, useState } from "react";
import { Form, Input, Button, Select, notification } from "antd";
import { useSymbolList } from "../../react-query/symbol";
import { useLogin } from "../../react-query/auth";
import { UserInfoType } from "../../api/auth/typings";
import { useNavigate } from "react-router-dom";
import { LOGIN_INFO } from "../../constant";

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const { data: symbols = [], isLoading } = useSymbolList();
  const { mutateAsync: loginToSystem, isPending } = useLogin();

  const filteredOptions = useMemo(
    () => symbols.filter((o) => !selectedOptions.includes(o)),
    [symbols]
  );

  const onFinish = useCallback(async (values: UserInfoType) => {
    await loginToSystem(values)
      .then((response) => {
        localStorage.setItem(LOGIN_INFO, JSON.stringify(response));
      })
      .then(() => {
        navigate({
          pathname: "/market",
        });
      })
      .catch(() => {
        notification.error({
          message: "Login Failed",
          placement: "top",
          duration: 3,
        });
      });
  }, []);

  return (
    <div className="grid place-items-center content-center h-screen">
      <div className="text-4xl font-bold pb-6">Welcome to Login </div>
      <Form
        name="basic"
        style={{ width: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<UserInfoType>
          name="symbol"
          label="Symbol Select"
          hasFeedback
          rules={[{ required: true, message: "Please select a symbol!" }]}
        >
          <Select
            placeholder="Please select a symbol"
            disabled={isLoading || symbols.length === 0}
            showSearch
            value={selectedOptions}
            onChange={setSelectedOptions}
            options={filteredOptions.map((symbol) => ({
              label: symbol,
              value: symbol,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item<UserInfoType>
          label="Password"
          name="pin"
          rules={[{ required: true, message: "Please input your pin!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: 400 }}
            loading={isPending}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
