import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./routes/Home";
import { Sidebar } from "./components/shared/sidebar/Sidebar";
import { TopNav } from "./components/shared/navbar/TopNav";
import KeysNav from "./routes/keys/components/KeysNav";
import KeysIndex from "./routes/keys/Index";
import KeysGen from "./routes/keys/KeysGenerate";
import KeysIE from "./routes/keys/KeysImportExport";
import KeyringManagement from "./routes/keys/KeyringManagement";

// Layout for the /keys route
const KeysLayout = () => {
  return (
    <div>
      <KeysNav />
      <Outlet />
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

            {/* Define the /keys route with nested sub-routes */}
            <Route path="/keys" element={<KeysLayout />}>
              {/* This is the index route for /keys */}
              <Route index element={<KeysIndex />} />

              {/* Sub-routes under /keys */}
              <Route path="generate" element={<KeysGen />} />
              <Route path="import-export" element={<KeysIE />} />
              <Route path="keyring" element={<KeyringManagement />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
