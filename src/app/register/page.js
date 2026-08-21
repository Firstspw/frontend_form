"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Register() {
  const [form, setForm] = useState({
    txt_firstname: "",
    txt_lastname: "",
    txt_username: "",
    txt_password: ""
  });

  const handleChange = (e) => {
    setForm ({ 
      ...form, 
      [e.target.name]: e.target.value, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://api.itdev.cmtc.ac.th/users", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          firstname: form.txt_firstname,
          lastname: form.txt_lastname, 
          username: form.txt_username,
          password: form.txt_password
        }),
      });

      const result = await res.json(); // แปลง response ที่ได้กลับมาให้เป็น JS object

      if (res.ok) {// สำเร็จ status 201
        await Swal.fire({
          icon: "success",
          title: `บันทึกข้อมูลสำเร็จ`,
          text: "บันทึกข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#4f46e5", 
        });

      } else if (res.status === 400) { // ถ้า status เป็น 400 (ข้อมูลที่ส่งไปไม่ถูกต้อง)

        await Swal.fire({ // validation error status 400
          icon: "warning",
          title: `ข้อมูลไม่ถูกต้อง`,
          text: result.message || "เกิดข้อผิดพลาด",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#e0e546",
        });

      } else if (res.status === 500) {

        await Swal.fire({
          icon: "error",
          title: `เกิดข้อผิดพลาด`,
          text: result.message || "เซิร์ฟเวอร์มีปัญหา",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#e54646",
        });
      }

    } catch (error) {
      await Swal.fire({
        icon: "warning",
        title: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        text: "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#e54646",
      });
    }
  };

  return ( // ส่วนแสดงผล UI ของฟอร์ม
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 sm:p-6">
    
      <div className="absolute -top-16 -left-16 w-56 h-56 sm:-top-24 sm:-left-24 sm:w-96 sm:h-96 bg-fuchsia-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="absolute -bottom-16 -right-16 w-56 h-56 sm:-bottom-24 sm:-right-24 sm:w-96 sm:h-96 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>

      <div className="relative w-full max-w-md sm:max-w-md rounded-2xl sm:rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-2xl shadow-purple-950/40 border border-white/70 overflow-hidden ring-1 ring-white/40">

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 sm:px-8 pt-8 sm:pt-10 pb-14 sm:pb-16 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]"></div>

          <h1 className="relative text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Register
          </h1>
          <p className="relative text-indigo-100 text-xs sm:text-sm mt-2 font-light">
            สมัครสมาชิกเพื่อเริ่มต้นใช้งาน ✨
          </p>

          <div className="absolute -bottom-8 sm:-bottom-9 left-1/2 -translate-x-1/2">
          
            <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full bg-white shadow-lg flex items-center justify-center text-3xl sm:text-4xl border-4 border-white ring-4 ring-indigo-200/60">
              👤
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-10 sm:pt-12 pb-8 px-6 sm:px-8 space-y-4">
          {/* แท็ก form เมื่อกด submit จะเรียก handleSubmit */}
            <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="block text-sm text-black font-medium mb-1.5">ชื่อ</label>
                  {/* label กำกับช่องกรอกชื่อ */}
                  <input type="text" name="txt_firstname" defaultValue={""} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400" />
                  {/* ช่องกรอกชื่อ, name ตรงกับ key ใน state, onChange อัปเดต state ทุกครั้งที่พิมพ์ */}
                </div>

                <div>
                  <label className="block text-sm text-black font-medium mb-1.5">นามสกุล</label>
                  {/* label กำกับช่องกรอกนามสกุล */}
                  <input type="text" name="txt_lastname" defaultValue={""} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400" />
                </div>

                <div>
                  <label className="block text-sm text-black font-medium mb-1.5">ชื่อผู้ใช้</label>
                  <input type="text" name="txt_username" defaultValue={""} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400" />
                </div>

                <div>
                  <label className="block text-sm text-black font-medium mb-1.5">รหัสผ่าน</label>
                  <input type="password" name="txt_password" defaultValue={""} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400" />
                </div>
            </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}