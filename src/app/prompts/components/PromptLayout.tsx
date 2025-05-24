import React from "react";
import PromptHeader from "./Header";

export const PromptLayout = {
  Main: ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        <PromptHeader />
        <main className="flex h-[calc(100vh-4rem)]">{children}</main>
      </>
    );
  },
  Left: ({ children }: { children: React.ReactNode }) => {
    return <div className="w-1/2 flex flex-col border-r border-gray-300 p-6  gap-6">{children}</div>;
  },
  Right: ({ children }: { children: React.ReactNode }) => {
    return <div className="w-1/2 flex flex-col">{children}</div>;
  },
  Content: ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
      <div className="space-y-2">
        <label className="block text-md font-bold text-gray-700">{title}</label>
        <div className="flex gap-2">{children}</div>
      </div>
    );
  }
};
