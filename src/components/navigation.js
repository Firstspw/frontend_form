"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  // สถานะเปิด/ปิดเมนูบนจอมือถือ (ใช้แค่ toggle การแสดงผล ไม่กระทบ logic อื่นของแอป)
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "หน้าแรก" },
    { href: "/about", label: "เกี่ยวกับ" },
    { href: "/service", label: "บริการของเรา" },
    { href: "/contact", label: "ติดต่อ" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            onClick={() => setIsOpen(false)}
          >
            MyWebsite
          </Link>

          {/* Menu: แสดงเป็นแถวปกติตั้งแต่จอ md ขึ้นไป */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 transition duration-300"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/register"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-105 hover:shadow-lg transition duration-300"
            >
              สมัครสมาชิก
            </Link>

            <Link
              href="/users"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-105 hover:shadow-lg transition duration-300"
            >
              ผู้ใช้งาน
            </Link>
          </div>

          {/* ปุ่ม Hamburger: แสดงเฉพาะจอเล็กกว่า md */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="เปิด/ปิดเมนู"
            aria-expanded={isOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* เมนูมือถือ: เลื่อนลงมาแสดงเมื่อ isOpen เป็น true */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 pb-4 text-gray-700 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-2 py-2.5 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition duration-200"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="mt-2 px-5 py-2.5 rounded-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition duration-300"
            >
              สมัครสมาชิก
            </Link>

            <Link
              href="/users"
              onClick={() => setIsOpen(false)}
              className="mt-2 px-5 py-2.5 rounded-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition duration-300"
            >
              ผู้ใช้งาน
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}