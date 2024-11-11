import Cipher from "./routes/Cipher";
import { Outlet, Route, Routes } from "react-router-dom";
import { TopNav } from "./components/shared/navbar/TopNav";
import { Sidebar } from "./components/shared/sidebar/Sidebar";
import Home from "./routes/Home";
import KeysNav from "./routes/keys/components/KeysNav";
import KeyringManagement from "./routes/keys/KeyringManagement";
import PGPKeys from "./routes/keys/PGPKeys";

// Layout for the /keys route
const KeysLayout = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-center items-center">
        <KeysNav />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/keys" element={<KeysLayout />}>
              <Route index element={<PGPKeys />} />
              <Route path="messages" element={<KeyringManagement />} />
              <Route path="files" element={<KeyringManagement />} />
            </Route>
            <Route path="/cipher" element={<Cipher />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
