import React from "react";

const Pagenation = ({
  page,
  totalPages,
  setPage
}: {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="px-2 py-1 border rounded disabled:opacity-50 cursor-pointer"
        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        이전
      </button>
      <span>
        {page} / {totalPages}
      </span>
      <button
        className="px-2 py-1 border rounded disabled:opacity-50 cursor-pointer"
        onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default Pagenation;
