"use client";

import { createContext, useContext } from "react";
import type { InvitationContent } from "./types";

const InvitationContext = createContext<InvitationContent | null>(null);

export const InvitationProvider = InvitationContext.Provider;

/** Nội dung của trang thiệp đang hiển thị (Tân Hôn hoặc Vu Quy). */
export const useInvitation = (): InvitationContent => {
  const content = useContext(InvitationContext);
  if (!content) {
    throw new Error("useInvitation phải được dùng bên trong <InvitationProvider>");
  }
  return content;
};
