"use client";
import { createContext, useContext } from "react";

export const InquiryContext = createContext();

export const useInquiry = () => useContext(InquiryContext);