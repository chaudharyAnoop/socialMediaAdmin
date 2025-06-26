import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import UsersList from "./UserList/UserList";
import AdminUserSearch from "./adminUserSearch/AdminUserSearch";
import AdminAllPosts from "./AdminAllPost/AdminAllPost";
import UserFollow from "./UserFollow/userFollow";
import AdminLogin from "./AdminLogin/adminLogin";

export function AppRouter() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/usersearch" element={<AdminUserSearch />} />
        <Route path="/allposts" element={<AdminAllPosts />} />
        <Route path="/follow" element={<UserFollow />} />
        <Route path="/auth" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
