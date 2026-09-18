import type { ReactNode } from "react";

export default function MobileFrame({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-[252px] rounded-[34px] border-[6px] border-[#202822] bg-[#202822] p-[4px] shadow-[0_24px_50px_-20px_rgba(0,0,0,.7)]"><div className="relative overflow-hidden rounded-[26px] bg-white"><div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#202822]"/><div className="h-[420px]">{children}</div></div></div>;
}
