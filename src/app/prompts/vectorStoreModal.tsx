import Modal from "@/components/modal";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Tool } from "@/types/prompts/tool";
import { tools } from "@/utils/prompts/tools";
import { uploadVectorStoreFile } from "@/utils/vectorStore";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedTools: Tool[]) => void;
  children?: React.ReactNode;
  tools: Tool[];
}

const VectorStoreModal = (props: ModalProps) => {
  const [selectedTools, setSelectedTools] = useState<Tool[]>(props.tools);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const fileUpload = async () => {
    if (selectedFile) {
      const response = await uploadVectorStoreFile({ name: selectedFile.name, file: selectedFile });
      console.log(response);
    }
  };

  return (
    <Modal {...props} onConfirm={() => props.onConfirm(selectedTools)}>
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

      <div className="flex flex-col gap-2 mt-4">
        <label className="block text-lg font-medium text-gray-700 mb-1">md 파일 업로드</label>
        <input
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none hover:bg-gray-200 cursor-pointer"
        />
        {selectedFile && <div className="text-xs text-gray-600 mt-1">선택된 파일: {selectedFile.name}</div>}
        <Button variant="primary" className="mt-2 w-fit" onClick={fileUpload} disabled={!selectedFile}>
          업로드
        </Button>
      </div>
    </Modal>
  );
};

export default VectorStoreModal;
