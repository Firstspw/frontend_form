"use client";

import React, { useState } from "react";
import swal from "sweetalert2";

export default function Register() {
  // ===== State เก็บข้อมูลฟอร์ม =====
  // useState เก็บค่าจาก input ทั้ง 4 ช่องไว้ใน object เดียว (form)
  // เริ่มต้นทุกช่องเป็นค่าว่าง ""
  const [form, setForm] = useState({
    txt_firstname: "",
    txt_lastname: "",
    txt_username: "",
    txt_password: "",
  });

  // ===== ฟังก์ชันจัดการเมื่อผู้ใช้พิมพ์ในช่อง input =====
  // ทำงานทุกครั้งที่มีการเปลี่ยนแปลงค่าใน input (onChange)
  // ใช้ e.target.name เพื่อรู้ว่ากำลังแก้ไข field ไหน แล้วอัปเดตเฉพาะ field นั้น
  // โดยคง (spread) ค่าฟิลด์อื่น ๆ เดิมไว้ทั้งหมด (...form)
  const handleChange = (e) => {
    setForm ({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===== ฟังก์ชันจัดการเมื่อกดปุ่ม "บันทึกข้อมูล" (submit ฟอร์ม) =====
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกัน browser reload หน้าเว็บแบบปกติของฟอร์ม HTML
    console.log("Form Data :", form);
    try {
      // ยิง request แบบ POST ไปยัง API เพื่อสมัครสมาชิก
      // แนบข้อมูลฟอร์มในรูปแบบ JSON ผ่าน body
      const res = await fetch("https://api.itdev.cmtc.ac.th/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: form.txt_firstname,
          lastname: form.txt_lastname,
          username: form.txt_username,
          password: form.txt_password,
        }),
      });

      // แปลง response ที่ได้กลับมาให้เป็น JavaScript object
      const result = await res.json();

      // ตรวจสอบ status code ที่ได้รับกลับมา แล้วแสดง popup (SweetAlert2) ตามสถานการณ์
      if (res.ok) {
        // สำเร็จ status 201 (หรือ 2xx) -> แสดงข้อความสำเร็จ
        await swal.fire({
          icon: "success",
          title: `บันทึกข้อมูลสำเร็จ (status: ${res.status})`,
          text: "บันทึกข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#4f46e5",
        });

      } else if (res.status === 400) {

        // ข้อมูลที่ส่งไปไม่ผ่านการตรวจสอบ (validation error) -> แจ้งเตือนสีเหลือง
        await swal.fire({
          icon: "warning",
          title: `ข้อมูลไม่ถูกต้อง (status: ${res.status})`,
          text: result.message || "เกิดข้อผิดพลาด",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#e0e546",
        });

      } else if (res.status === 500) {

        // เซิร์ฟเวอร์เกิดข้อผิดพลาดภายใน -> แจ้งเตือนสีแดง
        await swal.fire({
          icon: "error",
          title: `เกิดข้อผิดพลาด (status: ${res.status})`,
          text: result.message || "เซิร์ฟเวอร์มีปัญหา",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#e54646",
        });
      }

    } catch (error) {
      // กรณีเชื่อมต่อ API ไม่ได้เลย (เช่น เน็ตหลุด, เซิร์ฟเวอร์ล่ม, CORS ฯลฯ)
      await swal.fire({
        icon: "warning",
        title: "ไม่สามารถเชื่อมต่อกับเชิฟเวอร์ได้",
        text: "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#e54646",
      });
    }
  };

  return (
    // ===== พื้นหลังหน้าเว็บ =====
    // ไล่เฉดสี (gradient) โทนม่วง-น้ำเงิน-ชมพู ให้ความรู้สึกทันสมัย นุ่มนวล
    // overflow-hidden กันไม่ให้วงกลมเบลอที่มุมจอล้นออกมาแล้วเกิด scrollbar
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-6">

      {/* ===== Background Effect: วงกลมเบลอสีสันตกแต่งพื้นหลัง (decorative only) ===== */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-fuchsia-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>

      {/* ระยิบระยับเล็ก ๆ กระจายรอบการ์ด เพิ่มลูกเล่นให้พื้นหลังไม่โล่งเกินไป */}
      <div className="absolute top-16 right-24 w-2 h-2 bg-white rounded-full opacity-70 animate-ping"></div>
      <div className="absolute bottom-24 left-20 w-2 h-2 bg-yellow-200 rounded-full opacity-70 animate-ping [animation-delay:0.5s]"></div>
      <div className="absolute top-1/3 left-12 w-1.5 h-1.5 bg-sky-200 rounded-full opacity-60 animate-ping [animation-delay:1s]"></div>

      {/* ===== การ์ดฟอร์มสมัครสมาชิก ===== */}
      {/* backdrop-blur + bg ขาวโปร่งใส ให้เอฟเฟกต์กระจกฝ้า (glassmorphism) ลอยอยู่เหนือพื้นหลัง */}
      <div className="relative w-full max-w-md rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-2xl shadow-purple-950/40 border border-white/70 overflow-hidden ring-1 ring-white/40">

        {/* Header: แถบหัวการ์ดไล่เฉดสี พร้อมชื่อหัวข้อและคำบรรยาย */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 pt-10 pb-16 text-center relative">
          {/* เส้นประดับบาง ๆ มุมบนของ header เพิ่มมิติ */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]"></div>

          <h1 className="relative text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Register
          </h1>
          <p className="relative text-indigo-100 text-sm mt-2 font-light">
            สมัครสมาชิกเพื่อเริ่มต้นใช้งาน ✨
          </p>

          {/* Icon วงกลมลอยคาบเกี่ยวขอบล่างของ header */}
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
            <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-white shadow-lg flex items-center justify-center text-4xl border-4 border-white ring-4 ring-indigo-200/60">
              👤
            </div>
          </div>
        </div>

        {/* Form: ช่องกรอกข้อมูลทั้งหมด (โครงสร้าง/logic เดิมทุกประการ) */}
        <form onSubmit={handleSubmit} className="pt-14 pb-9 px-8 space-y-4">
            <div className="space-y-4">
                <div>
                  <label className="block text-sm text-indigo-950 font-semibold mb-1.5 tracking-wide">ชื่อ</label>
                  <input
                    type="text"
                    name="txt_firstname"
                    defaultValue={""}
                    onChange={handleChange}
                    placeholder="Firstname"
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-indigo-950 font-semibold mb-1.5 tracking-wide">นามสกุล</label>
                  <input
                    type="text"
                    name="txt_lastname"
                    defaultValue={""}
                    onChange={handleChange}
                    placeholder="Lastname"
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-indigo-950 font-semibold mb-1.5 tracking-wide">ชื่อผู้ใช้</label>
                  <input
                    type="text "
                    name="txt_username"
                    defaultValue={""}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-indigo-950 font-semibold mb-1.5 tracking-wide">รหัสผ่าน</label>
                  <input
                    type="password"
                    name="txt_password"
                    defaultValue={""}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400"
                  />
                </div>
            </div>

          {/* ปุ่ม submit: ไล่เฉดสีเดียวกับ header ให้ดีไซน์เป็นชุดเดียวกัน พร้อม hover/active effect */}
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/40 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}