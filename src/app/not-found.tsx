import Link from "next/link";
import { PushButton } from "@/components/duo/PushButton";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFF4E5] dark:bg-[#342416] text-5xl">
        🚧
      </div>
      <h1 className="font-kurdish text-3xl font-black text-[#4B4B4B] dark:text-white">
        404 — پەڕەکە بەردەست نییە
      </h1>
      <p className="mt-2 text-sm text-[#777777] dark:text-[#8495A0] max-w-md">
        لە ئێستادا ئەم وێبسایتە تەنها بۆ نیشاندانی دیمۆی وانەی پیتی GH ئامادەکراوە.
        <br />
        This showcase demo is currently limited to the GH Phonics lesson.
      </p>
      <Link href="/gh-demo" className="mt-6">
        <PushButton variant="green" className="px-8 py-3 text-sm">
          بڕۆ بۆ وانەی دیمۆ (Go to Demo)
        </PushButton>
      </Link>
    </div>
  );
}
