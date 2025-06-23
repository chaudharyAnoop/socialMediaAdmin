import { useState } from "react";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import styles from "./App.module.css";
import UsersList from "./pages/UserList/UserList";
import AdminUserSearch from "./pages/adminUserSearch/AdminUserSearch";
import AdminAllPosts from "./pages/AdminAllPost/AdminAllPost";

function App() {
  return (
    <div className={styles.nav}>
      <div className={styles.main}>
        {/* <NavigationBar /> */}
        <BrowserRouter>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<UsersList />} />
            <Route path="/usersearch" element={<AdminUserSearch />} />
            <Route path="/allposts" element={<AdminAllPosts />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
