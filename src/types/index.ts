type SidebarRoutesType = {
  title: string;
  value: string;
  icon: string;
  href: string;
};

type Notification = {
  id: string;
  type: "info" | "warning" | "success" | "error";
  message: string;
};

export type { SidebarRoutesType, Notification };
