"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

const API_URL = "https://api.itdev.cmtc.ac.th/users";

export default function FormEdit() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // ============================================================
  // แก้ที่ 1: hook ทุกตัวต้องอยู่บนสุด ห้ามมี return มาคั่นกลาง
  // ============================================================
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

  // ============================================================
  // แก้ที่ 2: ดึงเฉพาะ id ที่กำลังแก้ไข แล้วเติมค่าลงฟอร์ม
  // ============================================================
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

      // ถ้าไม่ได้กรอกรหัสผ่านใหม่ จะไม่ส่งฟิลด์นี้ไป
      // ป้องกันการทับรหัสผ่านเดิมด้วยค่าว่าง
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

      // ============================================================
      // แก้ที่ 4: ประกาศ result ก่อนใช้งาน
      // .catch(() => ({})) กันกรณี server ไม่ได้ส่ง JSON กลับมา
      // ============================================================
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

  // ============================================================
  // early return ย้ายลงมาไว้ตรงนี้ หลัง hook ทั้งหมดถูกเรียกครบแล้ว
  // ============================================================
  if (isLoading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;
  if (isError) return <p className="p-6">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md border">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            แก้ไขข้อมูลสมาชิก #{id}
          </h1>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-5">
          <label className="text-black">กรุณาระบุชื่อ</label>
          <input
            type="text"
            name="txt_firstname"
            value={form.txt_firstname} /* แก้ที่ 3: เดิมเป็น defaultValue */
            onChange={handleChange}
            className="w-full border text-black border-black rounded-md px-4 py-2"
            placeholder="firstname"
          />

          <label className="text-black">กรุณาระบุนามสกุล</label>
          <input
            type="text"
            name="txt_lastname"
            value={form.txt_lastname}
            onChange={handleChange}
            className="w-full border text-black border-black rounded-md px-4 py-2"
            placeholder="lastname"
          />

          <label className="text-black">Username</label>
          <input
            type="text"
            name="txt_username"
            value={form.txt_username}
            onChange={handleChange}
            className="w-full border text-black border-black rounded-md px-4 py-2"
            placeholder="username"
          />

          <label className="text-black">
            Password{" "}
            <span className="text-sm text-gray-500">
              (เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)
            </span>
          </label>
          <input
            type="password"
            name="txt_password"
            value={form.txt_password}
            onChange={handleChange}
            className="w-full border text-black border-black rounded-md px-4 py-2"
            placeholder="password"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/users")}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}