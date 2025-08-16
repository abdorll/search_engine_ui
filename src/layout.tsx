import { PropsWithChildren } from "react";
import Header from "./components/Header";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <main>{children}</main>
      </div>
    </>
  );
}

export default Layout;
