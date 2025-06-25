import NavigationBar from "./components/NavigationBar/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import UsersList from "./pages/UserList/UserList";
import AdminUserSearch from "./pages/adminUserSearch/AdminUserSearch";
import AdminAllPosts from "./pages/AdminAllPost/AdminAllPost";
import UserFollow from "./pages/UserFollow/userFollow";
import AdminLogin from "./pages/AdminLogin/adminLogin";

function App() {
  return (
    <div className={styles.nav}>
      <div className={styles.main}>
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
      </div>
    </div>
  );
}

export default App;
