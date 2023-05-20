import { Login } from "../components/login";
import { Register } from "../components/register";

export const Auth = () => {
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  );
};
