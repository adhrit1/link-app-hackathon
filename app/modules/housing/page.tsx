"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HousingEntry() {
  const router = useRouter();
  useEffect(() => {
    const quizDone = localStorage.getItem("quizCompleted") === "true";
    const selectedDorm = localStorage.getItem("selectedDorm");
    if (!quizDone) {
      router.replace("/modules/freshman-flow");
    } else if (selectedDorm) {
      router.replace(`/modules/dorm-life?dorm=${encodeURIComponent(selectedDorm)}`);
    } else {
      router.replace("/modules/freshman-flow");
    }
  }, [router]);
  return null;
}