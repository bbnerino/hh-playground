import Modal from "@/components/modal";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { uploadVectorStoreFile } from "@/utils/vectorStore";
import { VectorCollection } from "@/types/prompts/vectorStore";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedVectorCollections: VectorCollection[]) => void;
  children?: React.ReactNode;
  vectorCollections: VectorCollection[];
}

const VectorStoreModal = (props: ModalProps) => {
  const [selectedCollections, setSelectedCollections] = useState<VectorCollection[]>(props.vectorCollections);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string>("");

  const handleRemoveTool = (toolName: string) => {
    setSelectedCollections(selectedCollections.filter((collection) => collection.name !== toolName));
  };

  useEffect(() => {
    setSelectedCollections(props.vectorCollections);
  }, [props.vectorCollections]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const fileUpload = async () => {
    if (selectedFile) {
      const response = await uploadVectorStoreFile({ name: selectedFile.name, file: selectedFile });
      setSelectedDescription("");
      setSelectedFile(null);
      console.log(response);
      const { name, count } = response;
      setSelectedCollections([...selectedCollections, { name, description: selectedDescription, count }]);
    }
  };

  const [vectorCollections, setVectorCollections] = useState<VectorCollection[]>([]);

  const fetchVectorCollections = async () => {
    const response = await fetch("/api/vectorStore/searchDocuments/all");
    const data = await response.json();
    console.log(data);
    setVectorCollections(data.collections || []);
  };

  useEffect(() => {
    if (props.open) {
      fetchVectorCollections();
    }
  }, [props.open]);

  const handleSelectVectorCollection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = vectorCollections.find((collection) => collection.name === e.target.value);
    if (selected && !selectedCollections.find((t) => t.name === selected.name)) {
      setSelectedCollections([...selectedCollections, selected]);
    }
  };

  return (
    <Modal {...props} onConfirm={() => props.onConfirm(selectedCollections)}>
      <div className="flex flex-col gap-2 mt-4">
        <label className="block text-lg font-medium text-gray-700 mb-1">벡터 컬렉션 선택</label>
        <select
          className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none hover:bg-gray-200 cursor-pointer"
          onChange={handleSelectVectorCollection}
        >
          <option value="">선택</option>
          {vectorCollections?.map((collection) => (
            <option key={collection.name} value={collection.name}>
              {collection.name}
            </option>
          ))}
        </select>

        {selectedFile && (
          <>
            <label className="block text-lg font-medium text-gray-700 mb-1">벡터 컬렉션 설명</label>
            <input
              type="text"
              value={selectedDescription}
              onChange={(e) => setSelectedDescription(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none"
            />
          </>
        )}

        {selectedFile && (
          <>
            <div className="text-xs text-gray-600 mt-1">선택된 파일: {selectedFile.name}</div>
            <Button variant="primary" className="mt-2 w-fit" onClick={fileUpload} disabled={!selectedFile}>
              업로드
            </Button>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="block text-lg font-medium text-gray-700 mb-1">md 파일 추가</label>
        <input
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none hover:bg-gray-200 cursor-pointer"
        />

        {selectedFile && (
          <>
            <label className="block text-lg font-medium text-gray-700 mb-1">벡터 컬렉션 설명</label>
            <input
              type="text"
              value={selectedDescription}
              onChange={(e) => setSelectedDescription(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none"
            />
          </>
        )}

        {selectedFile && (
          <>
            <div className="text-xs text-gray-600 mt-1">선택된 파일: {selectedFile.name}</div>
            <Button variant="primary" className="mt-2 w-fit" onClick={fileUpload} disabled={!selectedFile}>
              업로드
            </Button>
          </>
        )}
      </div>

      <div className="mt-4">
        <div className="text-lg font-medium text-gray-700 mb-1">벡터 컬렉션</div>
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCollections.map((collection) => (
            <div
              key={collection.name}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
            >
              <span>{collection.name}</span>
              <button
                onClick={() => handleRemoveTool(collection.name)}
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

export default VectorStoreModal;
