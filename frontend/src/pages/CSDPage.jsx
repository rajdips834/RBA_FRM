import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SingleCSDRequestPageSimple from "./SingleCSDRequestPageSimple";
import MultiCSDRequestPageSimple from "./MultiCSDRequestPageSimple";
import CSDAttributeTool from "./CSDAttributeTool";

function CSDPage() {
  return (
    <Routes>
  <Route path="/" element={<Navigate to="/csd/builder" replace />} />
      <Route path="/single" element={<SingleCSDRequestPageSimple />} />
      <Route path="/multi" element={<MultiCSDRequestPageSimple />} />
  <Route path="/builder" element={<CSDAttributeTool />} />
    </Routes>
  );
}

export default CSDPage;