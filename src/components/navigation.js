import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            MyWebsite
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-8 text-gray-700 font-medium">
            <Link
              href="/"
              className="hover:text-blue-600 transition duration-300"
            >
              หน้าแรก
            </Link>

            <Link
              href="/about"
              className="hover:text-blue-600 transition duration-300"
            >
              เกี่ยวกับ
            </Link>

            <Link
              href="/service"
              className="hover:text-blue-600 transition duration-300"
            >
              บริการของเรา
            </Link>

            <Link
              href="/contact"
              className="hover:text-blue-600 transition duration-300"
            >
              ติดต่อ
            </Link>

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
        </div>
      </div>
    </nav>
  );
}
