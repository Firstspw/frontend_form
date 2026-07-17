"use client";

import React, { useState } from "react";
import swal from "sweetalert2";

export default function Register() { // ประกาศ component ชื่อ Register
  const [form, setForm] = useState({ // สร้าง state ชื่อ form ไว้เก็บค่าที่ผู้ใช้กรอก
    txt_firstname: "", // ค่าเริ่มต้นของชื่อ = ว่าง
    txt_lastname: "", // ค่าเริ่มต้นของนามสกุล = ว่าง
    txt_username: "", // ค่าเริ่มต้นของชื่อผู้ใช้ = ว่าง
    txt_password: "", // ค่าเริ่มต้นของรหัสผ่าน = ว่าง
  });

  const handleChange = (e) => { // ฟังก์ชันทำงานทุกครั้งที่ผู้ใช้พิมพ์ใน input
    setForm ({ // อัปเดต state form
      ...form, // คงค่าเดิมทั้งหมดไว้ก่อน
      [e.target.name]: e.target.value, // แล้วเปลี่ยนเฉพาะ field ที่ตรงกับ name ของ input นั้น
    });
  };

  const handleSubmit = async (e) => { // ฟังก์ชันทำงานตอนกด submit ฟอร์ม (เป็น async เพราะต้องรอ fetch)
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บ reload เมื่อ submit ฟอร์ม (ค่า default ของ browser)
    console.log("Form Data :", form); // แสดงค่าฟอร์มปัจจุบันใน console เพื่อ debug
    try {
      const res = await fetch("https://api.itdev.cmtc.ac.th/users", { // ส่ง request ไปยัง API เพื่อสมัครสมาชิก
        method: "POST", // ใช้ method POST เพราะเป็นการสร้างข้อมูลใหม่
        headers: {
          "Content-Type": "application/json", // บอก server ว่าข้อมูลที่ส่งไปเป็นรูปแบบ JSON
        },
        body: JSON.stringify({ // แปลง object เป็น JSON string เพื่อส่งไปกับ request
          firstname: form.txt_firstname, // ส่งค่าชื่อจาก state
          lastname: form.txt_lastname, // ส่งค่านามสกุลจาก state
          username: form.txt_username, // ส่งค่าชื่อผู้ใช้จาก state
          password: form.txt_password, // ส่งค่ารหัสผ่านจาก state
        }),
      });

      const result = await res.json(); // แปลง response ที่ได้กลับมาให้เป็น JS object

      if (res.ok) {// สำเร็จ status 201
        await swal.fire({
          icon: "success",
          title: `บันทึกข้อมูลสำเร็จ (status: ${res.status})`,
          text: "บันทึกข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#4f46e5",
        });

      } else if (res.status === 400) { // ถ้า status เป็น 400 (ข้อมูลที่ส่งไปไม่ถูกต้อง)

        await swal.fire({ // validation error status 400
          icon: "warning",
          title: `ข้อมูลไม่ถูกต้อง (status: ${res.status})`,
          text: result.message || "เกิดข้อผิดพลาด",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#e0e546",
        });

      } else if (res.status === 500) { // ถ้า status เป็น 500 (server มีปัญหา)

        await swal.fire({ // server error status 500
          icon: "error",
          title: `เกิดข้อผิดพลาด (status: ${res.status})`,
          text: result.message || "เซิร์ฟเวอร์มีปัญหา",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#e54646",
        });
      }

    } catch (error) { // ดักจับกรณี fetch ล้มเหลว เช่น เน็ตหลุด หรือเรียก API ไม่ได้เลย
      await swal.fire({
        icon: "warning",
        title: "ไม่สามารถเชื่อมต่อกับเชิฟเวอร์ได้",
        text: "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#e54646",
      });
    }
  };

  return ( // ส่วนแสดงผล UI ของฟอร์ม
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-12 pb-8 px-8 space-y-4">
          {/* แท็ก form เมื่อกด submit จะเรียก handleSubmit */}
            <div>
                <label className="block text-sm text-black font-medium mb-1.5">ชื่อ</label>
                {/* label กำกับช่องกรอกชื่อ */}
                <input type="text" name="txt_firstname" defaultValue={""} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400" />
                {/* ช่องกรอกชื่อ, name ตรงกับ key ใน state, onChange อัปเดต state ทุกครั้งที่พิมพ์ */}

                <label className="block text-sm text-black font-medium mb-1.5">นามสกุล</label>
                {/* label กำกับช่องกรอกนามสกุล */}
                <input type="text" name="txt_lastname" defaultValue={""} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400" />
                {/* ช่องกรอกนามสกุล ทำงานเหมือนช่องชื่อด้านบน */}

                <label className="block text-sm text-black font-medium mb-1.5">อีเมลผู้ใช้</label>
                {/* label กำกับช่องกรอกอีเมลผู้ใช้ */}
                <input type="email" name="txt_username" defaultValue={""} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400" />
                {/* ช่องกรอกอีเมลผู้ใช้ (username) สำหรับเข้าสู่ระบบ */}

                <label className="block text-sm text-black font-medium mb-1.5">รหัสผ่าน</label>
                {/* label กำกับช่องกรอกรหัสผ่าน */}
                <input type="password" name="txt_password" defaultValue={""} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-black placeholder:text-gray-400" />
                {/* ช่องกรอกรหัสผ่าน type="password" จะซ่อนตัวอักษรที่พิมพ์ */}
            </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
          >
            บันทึกข้อมูล
          </button>
          {/* ปุ่มกดส่งฟอร์ม type="submit" จะ trigger onSubmit ของ form ด้านบน */}
        </form>
      </div>
    </div>
  );
}