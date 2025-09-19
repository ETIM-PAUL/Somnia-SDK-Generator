import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ContractInputDashboard from './pages/contract-input-dashboard';
import SDKConfiguration from './pages/sdk-configuration';
import { ContractProvider } from "context/globalState";
import SDKGenerationProgress from "pages/sdk-generation-progress";
import SDKPreviewAndDownload from "pages/sdk-preview-download";

const Routes = () => {
  return (
    <ContractProvider>
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ContractInputDashboard />} />
        <Route path="/sdk-configuration" element={<SDKConfiguration />} />
        <Route path="/sdk-generation" element={<SDKGenerationProgress />} />
        <Route path="/sdk-preview-and-download" element={<SDKPreviewAndDownload />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
    </ContractProvider>
  );
};

export default Routes;
