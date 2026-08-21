"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

const API_URL = "https://api.itdev.cmtc.ac.th/users";

export default function FormEdit() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    txt_firstname: "",
    txt_lastname: "",
    txt_username: "",
    txt_password: "",
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();

      setForm({
        txt_firstname: data.firstname ?? "",
        txt_lastname: data.lastname ?? "",
        txt_username: data.username ?? "",
        txt_password: "", // ไม่ดึงรหัสผ่านเดิมกลับมาแสดง
      });
    } catch (error) {
      setIsError(true);
      await Swal.fire({ icon: "warning", title: "ไม่สามารถโหลดข้อมูลได้" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.txt_firstname.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุชื่อ",
        text: "กรุณากรอกชื่อ",
        confirmButtonText: "ตกลง",
      });
      return false;
    }

    if (!form.txt_lastname.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุนามสกุล",
        text: "กรุณากรอกนามสกุล",
        confirmButtonText: "ตกลง",
      });
      return false;
    }

    if (!form.txt_username.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุ Username",
        text: "กรุณากรอก Username",
        confirmButtonText: "ตกลง",
      });
      return false;
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const payload = {
        firstname: form.txt_firstname,
        lastname: form.txt_lastname,
        username: form.txt_username,
      };
      if (form.txt_password) {
        payload.password = form.txt_password;
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ!",
          text: "ปรับปรุงข้อมูลผู้ใช้เรียบร้อยแล้ว",
          confirmButtonColor: "#2E75B6",
        });

        router.push("/users"); // กลับไปหน้ารายชื่อ
        return;
      }

      if (response.status === 400) {
        await Swal.fire({
          icon: "warning",
          title: `ข้อมูลไม่ถูกต้อง (status: ${response.status})`,
          text: result.message || "เกิดข้อผิดพลาด",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#fecc00",
        });
      } else if (response.status >= 500) {
        await Swal.fire({
          icon: "error", // แก้ที่ 5: เดิมพิมพ์เป็น con
          title: `เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ (status: ${response.status})`,
          text: result.message || "เกิดข้อผิดพลาด",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#fe0505",
        });
      } else {
        // แก้ที่ 6: ดักกรณีที่เหลือ เช่น 401 / 403 / 404
        await Swal.fire({
          icon: "error",
          title: `บันทึกไม่สำเร็จ (status: ${response.status})`,
          text: result.message || "เกิดข้อผิดพลาด",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (error) {
      // เข้าที่นี่เฉพาะตอนยิง request ไม่ถึง server เลย
      await Swal.fire({
        icon: "warning",
        title: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        text: "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#fc006dcc",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;
  if (isError) return <p className="p-6">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 sm:p-6">

      <div className="absolute -top-16 -left-16 w-56 h-56 sm:-top-24 sm:-left-24 sm:w-96 sm:h-96 bg-fuchsia-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="absolute -bottom-16 -right-16 w-56 h-56 sm:-bottom-24 sm:-right-24 sm:w-96 sm:h-96 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>

      <div className="relative w-full max-w-md sm:max-w-md rounded-2xl sm:rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-2xl shadow-purple-950/40 border border-white/70 overflow-hidden ring-1 ring-white/40">
      
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 sm:px-8 pt-8 sm:pt-10 pb-14 sm:pb-16 text-center relative">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <h1 className="relative text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              แก้ไขข้อมูลสมาชิก #{id}
            </h1>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-5">
          <label className="block text-sm text-black font-medium mb-1.5">
            ชื่อ
          </label>
          <input
            type="text"
            name="txt_firstname"
            value={form.txt_firstname} /* แก้ที่ 3: เดิมเป็น defaultValue */
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400"
          />

          <label className="block text-sm text-black font-medium mb-1.5">
            นามสกุล
          </label>
          <input
            type="text"
            name="txt_lastname"
            value={form.txt_lastname}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400"
          />

          <label className="block text-sm text-black font-medium mb-1.5">
            ชื่อผู้ใช้
          </label>
          <input
            type="text"
            name="txt_username"
            value={form.txt_username}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400"
          />

          <label className="block text-sm text-black font-medium mb-1.5">
            รหัสผ่าน{" "}
            <span className="text-sm text-gray-500">
              (เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)
            </span>
          </label>
          <input
            type="password"
            name="txt_password"
            value={form.txt_password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/users")}
              className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 text-white font-semibold text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
