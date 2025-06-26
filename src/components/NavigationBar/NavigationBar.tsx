import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { FaBars, FaRegHeart, FaRegTimesCircle, FaSearch } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { Image, LogIn, User, Users } from "lucide-react";

import type { AppDispatch, RootState } from "../../redux/store";
import { toggleNavigationBar } from "../../redux/navigationBarSlice";

import styles from "./NavigationBar.module.css";

function NavigationBar() {
  const dispatch = useDispatch<AppDispatch>();
  const isSidebarVisible = useSelector(
    (state: RootState) => state.sidebar.isVisible
  );

  return (
    <div className={styles.outer}>
      <div className={isSidebarVisible ? styles.main : styles.hideMain}>
        <div className={styles.backs}>
          <h2 className={styles.heading}>Instagram</h2>
          <FaRegTimesCircle
            className={styles.back}
            onClick={() => dispatch(toggleNavigationBar())}
          />
        </div>
        <h2 className={styles.heading2}>In</h2>
        <ul className={styles.list}>
          <li className={styles.list_li}>
            <NavLink to="/" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <User className={styles.icon} />
                  <p className={styles.head}>Users</p>
                </div>
                <p className={styles.val}>all users</p>
              </div>
            </NavLink>
          </li>
          <li className={styles.list_li}>
            <NavLink to="/usersearch  " className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <FaSearch className={styles.icon} />
                  <p className={styles.head}> Search</p>
                </div>
                <p className={styles.val}>{"Users"}</p>
              </div>
            </NavLink>
          </li>{" "}
          <li className={styles.list_li}>
            <NavLink to="/allposts" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <Image className={styles.icon} />
                  <p className={styles.head}> All Post</p>
                </div>
                <p className={styles.val}>18</p>
              </div>
            </NavLink>
          </li>{" "}
          <li className={styles.list_li}>
            <NavLink to="/follow" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <Users className={styles.icon} />
                  <p className={styles.head}>Follows</p>
                </div>
                <p className={styles.val}>5</p>
              </div>
            </NavLink>
          </li>{" "}
          <li className={styles.list_li}>
            <NavLink to="/auth" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <LogIn className={styles.icon} />
                  <p className={styles.head}>Auth</p>
                </div>
                <p className={styles.val}>authen..</p>
              </div>
            </NavLink>
          </li>{" "}
        </ul>
        <div className={styles.space}></div>
        <div className={styles.bottom}>
          {" "}
          <div className={styles.tile}>
            <div className={styles.name}>
              <FaCircleInfo className={styles.icon} />
              <p className={styles.head}> Help</p>
            </div>
          </div>{" "}
          <div className={styles.tile}>
            <div className={styles.name}>
              <FaBars className={styles.icon} />
              <p className={styles.head}> More</p>
            </div>
          </div>
        </div>
      </div>
      {!isSidebarVisible && (
        <div className={styles.topbar}>
          <FaBars
            className={styles.menu}
            onClick={() => dispatch(toggleNavigationBar())}
          />{" "}
          <h2 className={styles.heading}>Instagram</h2>
          <FaRegHeart className={styles.menu} />
        </div>
      )}
    </div>
  );
}

export default NavigationBar;
