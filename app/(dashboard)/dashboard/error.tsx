"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  console.log(error.message);
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <h2 className="py-4  text-4xl font-bold ">Something went wrong!</h2>
       

      
          <p className="py-4 text-rose-400 text-4xl font-bold">Internal error</p>
    
     
        <div className="flex items-center gap-4 mx-auto justify-center">
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
          <Link href={"/"}>Back to main page</Link>
        </div>
      </div>
    </div>
  );
}
