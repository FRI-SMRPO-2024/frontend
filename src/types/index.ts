import { JwtPayload } from "jwt-decode";

type SidebarRoutesType = {
  title: string;
  value: string;
  icon: string;
  href: string;
  elevated?: boolean;
};

type Notification = {
  id: string;
  type: "info" | "warning" | "success" | "error";
  message: string;
};

interface ApiError {
  status: number;
  message: {
    error: string;
    message: string;
  };
}

interface DateExtractedData {
  day: string;
  month: string;
  year: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface TokenPayload extends JwtPayload {
  email: string;
}

export type {
  SidebarRoutesType,
  Notification,
  TokenPayload,
  ApiError,
  DateExtractedData,
};
