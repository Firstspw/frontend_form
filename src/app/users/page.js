async function getuser() {
  try {
    console.log("กำลังเชื่อมต่อ API...");
    const res = await fetch("https://api.itdev.cmtc.ac.th/users");

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("ไม่พบข้อมูลผู้ใช้งานนี้ (404 Not Found)");
      } else if (res.status === 500) {
        throw new Error("เซิร์ฟเวอร์มีปัญหา (500 Internal Server Error)");
      } else {
        throw new Error(
          `เกิดข้อผิดพลาดจากการเชื่อมต่อ (Status: ${res.status})`,
        );
      }
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("เกิดข้อผิดพลาด:", error.message);
    if (error.name === 'TypeError') {
      console.log("สาเหตุ: Network Error (เน็ตหลุด หรือ URL ไม่มีอยู่จริง)");
    } else {
      console.log("สาเหตุ:", error.message);
    }   
    return [];
  }
}

export default async function UsersPage() {
  const users = await getuser();
  console.log(users);
  return (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
      <div className="text-center text-2xl font-bold text-gray-800">User List</div>
  </div>
  )
}