// ฟังก์ชันดึงข้อมูลผู้ใช้จาก API (ใช้โค้ดเดิมทั้งหมด ไม่แก้ logic)
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
    if (error.name === "TypeError") {
      console.log("สาเหตุ: Network Error (เน็ตหลุด หรือ URL ไม่มีอยู่จริง)");
    } else {
      console.log("สาเหตุ:", error.message);
    }
    // คืนค่า object พิเศษกลับไป เพื่อให้หน้าเว็บรู้ว่าเกิด error และแสดงข้อความที่เหมาะสมได้
    return { error: true, message: error.message };
  }
}

// หน้าเพจหลัก (Server Component ของ Next.js) — ดึงข้อมูลแล้ว render เป็น UI
export default async function UsersPage() {
  const result = await getuser();
  console.log(result);

  // เช็คว่าดึงข้อมูลผิดพลาดหรือไม่ ถ้าผิดพลาดให้โชว์การ์ด error สวยๆ แทน
  const isError = result && result.error;
  const users = isError ? [] : result;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* หัวข้อของหน้า */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            รายชื่อผู้ใช้งาน
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ดึงข้อมูลจาก api.itdev.cmtc.ac.th
          </p>
        </div>

        {/* กรณีเกิดข้อผิดพลาดในการดึงข้อมูล */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-lg font-semibold text-red-600">
              ไม่สามารถโหลดข้อมูลได้
            </p>
            <p className="mt-1 text-sm text-red-500">{result.message}</p>
          </div>
        )}

        {/* กรณีดึงข้อมูลสำเร็จ แต่ไม่มีผู้ใช้เลย */}
        {!isError && users.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
            ยังไม่มีข้อมูลผู้ใช้งาน
          </div>
        )}

        {/* กรณีมีข้อมูลผู้ใช้ ให้แสดงเป็น grid การ์ด */}
        {!isError && users.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* หัวการ์ด: วงกลมแสดงตัวอักษรแรกของ firstname แทนรูปโปรไฟล์ + id */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-600">
                    {user.firstname?.trim().charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    #{user.id}
                  </span>
                </div>

                {/* ชื่อ-นามสกุล */}
                <p className="font-medium text-slate-800">
                  {user.firstname} {user.lastname}
                </p>

                {/* username (ไม่แสดง password เพื่อความปลอดภัย) */}
                <p className="text-sm text-slate-500">@{user.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}