import Image from "next/image";
import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";
import { auth } from "@/auth";

export default async function Home() {
  return (
    <>
      <HomePage/>
    </>
  );
}
