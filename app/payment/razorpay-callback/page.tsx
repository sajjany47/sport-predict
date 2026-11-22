import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import RazorpayCallback from "./RazorpayCallback";

export default function RazorpayCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        </main>
      }
    >
      <RazorpayCallback />
    </Suspense>
  );
}
