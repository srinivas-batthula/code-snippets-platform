// (pages)/layout.tsx
import { ReactNode } from "react";
import "../../styles/prism-theme.css";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
