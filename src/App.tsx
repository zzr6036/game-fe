import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import { Layout, Menu, Tooltip } from "antd";
import { FieldTimeOutlined } from "@ant-design/icons";
import LoginPage from "./pages/login";
import MarketPage from "./pages/market";
import RealTimePricePage from "./pages/real-time-price";
import "./App.css";
import { LOGIN_INFO, UserInfoContext } from "./constant";
import Symbol from "./components/Symbol";
import { isValidJson } from "./utils/calculate";

const { Header, Content, Footer, Sider } = Layout;
const { Item } = Menu;

const navMenus = [
  {
    key: "1",
    label: "View Market",
    link: "/market",
  },
  { key: "2", label: "Real Time Price", link: "/real-time-price" },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMenuKey, setSelectedMenuKey] = useState([""]);

  // Standardise url with navbar
  useEffect(() => {
    const pathname = location.pathname;
    const initialMenuKey =
      navMenus.find((menu) => menu.link === pathname)?.key ?? "1";
    setSelectedMenuKey([initialMenuKey]);
  }, [location]);

  const loginInfo = useMemo(() => {
    const info = localStorage.getItem(LOGIN_INFO) ?? "";
    return isValidJson(info) ? JSON.parse(info) : undefined;
  }, [location.pathname]);

  const isAuth = useMemo(() => (loginInfo ? true : false), [loginInfo]);

  // If unauthorised will auto logout and navigate to login page
  useEffect(() => {
    if (!isAuth) {
      navigate({
        pathname: "/",
      });
    }
  }, [isAuth]);

  const contextValue = useMemo(() => {
    return {
      symbol: loginInfo?.symbolInfo?.symbol ?? "",
      token: loginInfo?.kucoinTokenInfo?.token ?? "",
    };
  }, [loginInfo]);

  const logout = useCallback(() => {
    localStorage.removeItem(LOGIN_INFO);
    navigate({
      pathname: "/",
    });
  }, []);

  return (
    <>
      <Layout className="layout">
        {isAuth ? (
          <Sider breakpoint="lg" collapsedWidth="0" width={230}>
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              selectedKeys={selectedMenuKey}
              onClick={(val) => setSelectedMenuKey([val.key])}
            >
              {navMenus.map((menu) => (
                <Item key={menu.key}>
                  <Link to={menu.link}>{menu.label}</Link>
                </Item>
              ))}
            </Menu>
          </Sider>
        ) : null}
        <UserInfoContext.Provider value={contextValue}>
          <Layout>
            {isAuth ? (
              <Header className="header">
                <Symbol />
                <Tooltip title="Logout">
                  <FieldTimeOutlined onClick={logout} className="logout-icon" />
                </Tooltip>
              </Header>
            ) : null}
            <Content className="content">
              <div className="content-container">
                <Routes>
                  <Route path="/market" element={<MarketPage />} />
                  <Route
                    path="/real-time-price"
                    element={<RealTimePricePage />}
                  />
                  {isAuth ? (
                    <Route
                      path="*"
                      element={<Navigate to="/market" replace />}
                    />
                  ) : (
                    <Route path="/" element={<LoginPage />} />
                  )}
                </Routes>
              </div>
            </Content>
            <Footer className="footer">
              Demo App ©{new Date().getFullYear()} Created by kucoin
            </Footer>
          </Layout>
        </UserInfoContext.Provider>
      </Layout>
    </>
  );
}

export default App;
