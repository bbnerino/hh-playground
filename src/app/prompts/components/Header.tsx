import Button from "@/components/Button";
import Link from "next/link";

const PromptHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
      <h1 className="text-xl font-semibold">HH Prompts</h1>
      <div className="flex items-center gap-4">
        <Button variant="secondary">
          <Link href="/vectorStore">리뷰 데이터</Link>
        </Button>
      </div>
    </header>
  );
};

export default PromptHeader;
