"use client";
import Button from "@/components/Button";
import React, { useEffect, useState } from "react";
import Pagenation from "./components/Pagenation";
import VectorStoreModal from "./components/VectorStoreModal";
import Link from "next/link";

const columns = ["상품번호", "상품명", "리뷰상세내용", "shop_name"];
const PAGE_LIMIT = 50;

const StorePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [productId, setProductId] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    setLoading(true);
    getData();
  }, [page, productId]);

  const getData = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: PAGE_LIMIT.toString()
    });
    if (productId !== "") {
      params.append("productId", productId);
    }
    fetch(`/api/review?${params.toString()}`)
      .then((res) => res.json())
      .then(({ rows, total }) => {
        setData(rows);
        setTotal(total);
        setLoading(false);
      });
  };

  useEffect(() => {
    setPage(1);
  }, [productId]);

  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const onSearch = () => {
    setPage(1);
    setProductId(input);
  };
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return <div>{productId} Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold mb-4">리뷰 데이터</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Link href="/prompts">playground</Link>
          </Button>
        </div>
      </div>
      {/* 상품번호 필터 */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="productId" className="text-sm font-medium">
          상품번호 필터:
        </label>
        <input
          id="productId"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1 rounded"
          placeholder="상품번호 입력"
        />
        <Button onClick={onSearch} variant="secondary">
          검색
        </Button>
        <Button
          onClick={() => {
            setInput("");
            setProductId("");
          }}
        >
          초기화
        </Button>
        {productId !== "" && (
          <Button
            onClick={() => {
              if (productId === "") {
                alert("상품번호를 입력해주세요.");
                return;
              }
              setIsOpen(true);
            }}
          >
            벡터 저장
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="border px-2 py-1 bg-gray-100">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : ""}>
                {columns.map((col, index) => {
                  if (index === 0) {
                    return (
                      <td
                        key={col}
                        onClick={() => {
                          setProductId(row[col]);
                          setInput(row[col]);
                          setPage(1);
                        }}
                        className="border border-gray-200 px-2 py-1 cursor-pointer hover:bg-gray-200"
                      >
                        {row[col]}
                      </td>
                    );
                  }
                  return (
                    <td key={col} className="border border-gray-200 px-2 py-1">
                      {row[col]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 페이지네이션 UI */}
      <Pagenation page={page} totalPages={totalPages} setPage={setPage} />
      <VectorStoreModal open={isOpen} onClose={() => setIsOpen(false)} productId={productId} />
    </div>
  );
};

export default StorePage;
