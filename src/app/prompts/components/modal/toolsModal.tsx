import Modal from "@/components/modal";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Tool } from "@/types/prompts/tool";
import { tools } from "@/utils/prompts/tools";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedTools: Tool[]) => void;
  children?: React.ReactNode;
  tools: Tool[];
}

const ToolsModal = (props: ModalProps) => {
  const [selectedTools, setSelectedTools] = useState<Tool[]>(props.tools);

  const handleSelectTool = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tools.find((tool) => tool.function.name === e.target.value);
    if (selected && !selectedTools.find((t) => t.function.name === selected.function.name)) {
      setSelectedTools([...selectedTools, selected]);
    }
  };

  const handleRemoveTool = (toolName: string) => {
    setSelectedTools(selectedTools.filter((tool) => tool.function.name !== toolName));
  };
  useEffect(() => {
    setSelectedTools(props.tools);
  }, [props.tools]);

  return (
    <Modal {...props} onConfirm={() => props.onConfirm(selectedTools)}>
      <div className="h-full flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">추가할 툴 선택</label>
          <select
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
            onChange={handleSelectTool}
            value=""
          >
            <option value="" disabled>
              선택하세요
            </option>
            {tools.map((tool) => (
              <option key={tool.function.name} value={tool.function.name}>
                {tool.function.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTools.map((tool) => (
            <div
              key={tool.function.name}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
            >
              <span>{tool.function.name}</span>
              <button
                onClick={() => handleRemoveTool(tool.function.name)}
                className="cursor-pointer w-4 h-4 flex items-center justify-center hover:text-gray-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ToolsModal;
