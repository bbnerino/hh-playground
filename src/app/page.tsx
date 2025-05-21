import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <Link href="/prompts" className="mt-20">
        <Button color="blue">Prompts</Button>
      </Link>
    </div>
  );
}
