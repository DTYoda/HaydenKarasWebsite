"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const active = usePathname();

  return (
    <div className="gap-4 h-14 items-center flex justify-center">
      <Link
        className={
          "hover:bg-orange-400 hover:text-black transition-all w-20 h-8 rounded-md flex items-center justify-center " +
          (active == "/" ? "bg-orange-500" : "")
        }
        href="/"
      >
        HK
      </Link>
      <Link
        className={
          "hover:bg-orange-400 hover:text-black transition-all w-20 h-8 rounded-md flex items-center justify-center " +
          (active == "/portfolio" ? "bg-orange-500" : "")
        }
        href="/portfolio"
      >
        Work
      </Link>
      <Link
        className={
          "hover:bg-orange-400 hover:text-black transition-all w-20 h-8 rounded-md flex items-center justify-center " +
          (active == "/experience" ? "bg-orange-500" : "")
        }
        href="/experience"
      >
        Experience
      </Link>
      {/* <Link
        className={
          "hover:bg-orange-400 hover:text-black transition-all w-20 h-8 rounded-md flex items-center justify-center " +
          (active == "/about" ? "bg-orange-500" : "")
        }
        href="/about"
      >
        About
      </Link> */}
      <Link
        className={
          "hover:bg-orange-400 hover:text-black transition-all w-20 h-8 rounded-md flex items-center justify-center " +
          (active == "/contact" ? "bg-orange-500" : "")
        }
        href="/contact"
      >
        Contact
      </Link>
    </div>
  );
}
