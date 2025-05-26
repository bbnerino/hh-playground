import Modal from "@/components/modal";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { uploadVectorStoreFile } from "@/utils/vectorStore";
import { VectorCollection } from "@/types/prompts/vectorStore";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
}

const VectorStoreModal = (props: ModalProps) => {
  const [reviewList, setReviewList] = useState<string[]>([]);
  const [productName, setProductName] = useState<string>("");

  const [vectorCollections, setVectorCollections] = useState<VectorCollection[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 벡터 콜렉션 리스트 불러오기
  const fetchVectorCollections = async () => {
    const response = await fetch("/api/vectorStore/searchDocuments/all");
    const data = await response.json();
    setVectorCollections(data.collections || []);
  };

  const getData = async () => {
    const params = new URLSearchParams({ productId: props.productId });
    fetch(`/api/review?${params.toString()}`)
      .then((res) => res.json())
      .then(({ rows }) => {
        setReviewList(rows.map((row: any) => row.리뷰상세내용));
        setProductName(rows[0].상품명);
      });
  };

  useEffect(() => {
    if (props.open) {
      fetchVectorCollections();
      getData();
    }
  }, [props.open]);

  useEffect(() => {
    if (props.productId) {
      setProductName(props.productId);
    }
  }, [props.productId]);

  // 벡터스토어 업로드
  const handleUpload = async () => {
    setIsUploading(true);
    // 리뷰상세내용들을 합쳐서 하나의 텍스트 파일로 만듦
    const content = reviewList.join("\n\n");

    const response = await uploadVectorStoreFile({ name: `${props.productId}-${productName}`, text: content });

    setIsUploading(false);
    fetchVectorCollections();
  };

  // 벡터 콜렉션 삭제
  const handleDelete = async (name: string) => {
    await fetch(`/api/vectorStore`, {
      method: "DELETE",
      body: JSON.stringify({ name })
    });
    fetchVectorCollections();
  };

  return (
    <Modal {...props}>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md">
          <div className="font-bold mb-2">상품번호: {props.productId}</div>
          <div className="font-bold mb-2">상품명: {productName}</div>
          <div className="font-medium text-sm mb-2">콜렉션: {props.productId}-{productName}</div>
          <div className="mb-2">리뷰 개수: {reviewList.length}</div>
          <Button variant="secondary" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "업로드 중..." : "벡터스토어 업로드"}
          </Button>
        </div>
        <div>
          <div className="text-lg font-medium text-gray-700 mb-2">벡터 콜렉션 리스트</div>
          <div className="flex flex-wrap gap-2">
            {vectorCollections.length === 0 && <div className="text-gray-400">등록된 벡터 콜렉션이 없습니다.</div>}
            {vectorCollections.map((collection) => (
              <div
                key={collection.name}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
              >
                <span>{collection.name}</span>
                <button
                  onClick={() => handleDelete(collection.name)}
                  className="cursor-pointer w-4 h-4 flex items-center justify-center hover:text-gray-600"
                  title="삭제"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VectorStoreModal;
