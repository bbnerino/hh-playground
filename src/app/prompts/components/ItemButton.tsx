import { Tool } from "@/types/prompts/tool";
import React from "react";

const ItemButton = ({ name, handleRemoveTool }: { name: string; handleRemoveTool: (tool: string) => void }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
      <span>{name}</span>
      <button
        onClick={() => handleRemoveTool(name)}
        className="cursor-pointer w-4 h-4 flex items-center justify-center hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
};

export default ItemButton;
