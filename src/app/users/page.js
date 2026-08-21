"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const API_URL = "https://api.itdev.cmtc.ac.th/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setIsError(true);
      await Swal.fire({ icon: "warning", title: "ไม่สามารถโหลดข้อมูลได้" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    // TODO: เชื่อมกับหน้าแก้ไขสมาชิก / เปิดฟอร์มแก้ไข
    console.log("แก้ไขสมาชิก id:", id);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบสมาชิกคนนี้ใช่หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Status ${response.status}`);

      setUsers((prev) => prev.filter((user) => user.id !== id));
      await Swal.fire({
        icon: "success",
        title: "ลบข้อมูลสำเร็จ",
        confirmButtonColor: "#4f46e5",
      });
    } catch (error) {
      await Swal.fire({ icon: "error", title: "ไม่สามารถลบข้อมูลได้" });
    }
  };

  // ---- สถานะ: กำลังโหลด / error / ไม่มีข้อมูล ----
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-8 py-6 shadow-xl text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-gray-700 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-8 py-6 shadow-xl text-center">
          <p className="text-red-500 font-semibold mb-3">
            เกิดข้อผิดพลาดในการโหลดข้อมูล
          </p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-8 py-6 shadow-xl text-center text-gray-500">
          ยังไม่มีข้อมูลสมาชิกในระบบ
        </div>
      </div>
    );
  }

  // ---- แสดงผลข้อมูล: ตาราง (Desktop) + การ์ด (Mobile) ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white text-center mb-6 drop-shadow">
          รายชื่อสมาชิก
        </h1>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          {/* ตาราง สำหรับจอกว้าง */}
          <table className="w-full border-collapse hidden md:table">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-left text-white">
                <th className="p-3 font-semibold">ลำดับ</th>
                <th className="p-3 font-semibold">ชื่อ</th>
                <th className="p-3 font-semibold">นามสกุล</th>
                <th className="p-3 font-semibold">Username</th>
                <th className="p-3 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 even:bg-gray-50 hover:bg-indigo-50 transition-colors"
                >
                  <td className="p-3 text-center text-gray-500">{index + 1}</td>
                  <td className="p-3 text-gray-800">{user.firstname}</td>
                  <td className="p-3 text-gray-800">{user.lastname}</td>
                  <td className="p-3 text-gray-600">{user.username}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => router.push(`/users/edit/${user.id}`)}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-lg text-sm font-medium transition-colors"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* การ์ด สำหรับจอมือถือ */}
          <div className="md:hidden divide-y divide-gray-100">
            {users.map((user, index) => (
              <div key={user.id} className="p-4 hover:bg-indigo-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      ลำดับ {index + 1}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/users/edit/${user.id}`)}
                    className="flex-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-lg text-sm font-medium transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}