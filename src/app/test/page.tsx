"use client";

import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    fetch("http://localhost:3000/api/categories");
  }, []);

  return <div></div>;
}
