import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.js";
import AnalyzePage from "./pages/AnalyzePage.js";
import { DetailPage } from "./pages/DetailPage.js";
import { HistoryPage } from "./pages/HistoryPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { ResultPage } from "./pages/ResultPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";
import { LanguageProvider } from "./i18n/LanguageContext.js";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<AnalyzePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="projects/:id" element={<DetailPage />} />
            <Route path="result/:id" element={<ResultPage />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
