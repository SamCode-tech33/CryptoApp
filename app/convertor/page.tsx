"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Convertor() {
  return (
    <div>
      <div className="flex">
        <Link href="/coins" className="ml-16">
          <Button className="mr-4">Coins</Button>
        </Link>
        <Link href="/convertor">
          <Button className="ml-4">Convertor</Button>
        </Link>
      </div>
    </div>
  );
}
