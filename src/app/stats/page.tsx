import { permanentRedirect } from "next/navigation";
import React from "react";



export default function Home() {
  
  permanentRedirect("/stats/all");
  return <></>;
}