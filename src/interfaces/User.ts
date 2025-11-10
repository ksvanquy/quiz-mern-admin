export interface User {
  _id?: string; // optional khi add user mới
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  password?: string; // optional, chỉ dùng khi tạo hoặc đổi password
  createdAt?: string; // optional vì khi add mới chưa có
}
