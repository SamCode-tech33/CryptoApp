"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Convertor() {
  const router = useRouter();

  return (
    <div>
      <div className="flex ml-16">
        <Button onClick={() => router.push("/coins")} className="mr-4">
          Coins
        </Button>
        <Button onClick={() => router.push("/convertor")} className="ml-4">
          Convertor
        </Button>
      </div>
    </div>
  );
}
