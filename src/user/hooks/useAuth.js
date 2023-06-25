import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import Keycloak from "keycloak-js";

const useAuth = () => {
  const [isLogin, setLogin] = useState(false);
  const [token, setToken] = useState(null);
  const [, setCookies, removeCookie] = useCookies([
    "access_token",
    "user_type",
    "user_ID",
    "user_name",
  ]);
  const isRun = useRef(false);
  const client = useRef(null);

  const keycloakConfiguration = {
    url: "http://localhost:8080/",
    realm: "myrealm",
    clientId: "myclient",
  };

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;

    client.current = new Keycloak(keycloakConfiguration);

    client.current.init({ onLoad: "login-required" }).then((authenticated) => {
      console.log(client.current);
      setLogin(authenticated);
      setToken(client.current.token);
      setCookies("access_token", client.current.token);
      setCookies("user_type", client.current.tokenParsed.userType);
      setCookies("user_name", client.current.tokenParsed.name);
      setCookies("user_ID", client.current.tokenParsed.sub);
    });
  }, []);

  const logout = async () => {
    await client.current.logout();
    setToken(null);
    setLogin(false);
    removeCookie("access_token");
    removeCookie("user_type");
    removeCookie("user_ID");
    window.location.reload(client.current.init({ onload: "login-required" }));
  };

  return [isLogin, logout];
};

export default useAuth;
