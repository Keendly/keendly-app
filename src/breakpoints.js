import React from "react";
import Responsive from "react-responsive";

// Desktop, tablet and mobile setup
export const Desktop = ({ children }) =>
  <Responsive minWidth={992} children={children} />;
export const Tablet = ({ children }) =>
  <Responsive minWidth={768} maxWidth={992} children={children} />;
export const Mobile = ({ children }) =>
  <Responsive maxWidth={768} children={children} />;
export const AboveMobile = ({ children }) =>
  <Responsive minWidth={769} children={children} />;
export const BelowDesktop = ({ children }) =>
  <Responsive maxWidth={991} children={children} />;
