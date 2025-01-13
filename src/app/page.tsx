import React from "react";
import { permanentRedirect } from "next/navigation";

export default function Home(){
  permanentRedirect("/scout");
  return<></>;
}