import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { FaBars, FaRegHeart, FaRegTimesCircle, FaSearch } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { Image, User, Users } from "lucide-react";

import type { AppDispatch, RootState } from "../../redux/store";
import { toggleNavigationBar } from "../../redux/navigationBarSlice";

import styles from "./NavigationBar.module.css";
import Strings from "../../constants/strings";

function NavigationBar() {
  const dispatch = useDispatch<AppDispatch>();
  const isSidebarVisible = useSelector(
    (state: RootState) => state.sidebar.isVisible
  );

  return (
    <div className={styles.outer}>
      <div className={isSidebarVisible ? styles.main : styles.hideMain}>
        <div className={styles.backs}>
          <h2 className={styles.heading}>{Strings.NAVBAR_TITLE}</h2>
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
                  <p className={styles.head}>{Strings.NAVBAR_USERS}</p>
                </div>
                <p className={styles.val}>{Strings.NAVBAR_ALL_USERS}</p>
              </div>
            </NavLink>
          </li>
          <li className={styles.list_li}>
            <NavLink to="/usersearch" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <FaSearch className={styles.icon} />
                  <p className={styles.head}> {Strings.NAVBAR_SEARCH}</p>
                </div>
                <p className={styles.val}>{Strings.NAVBAR_USERS_SHORT}</p>
              </div>
            </NavLink>
          </li>{" "}
          <li className={styles.list_li}>
            <NavLink to="/allposts" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <Image className={styles.icon} />
                  <p className={styles.head}> {Strings.NAVBAR_ALL_POST}</p>
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
                  <p className={styles.head}>{Strings.NAVBAR_FOLLOWS}</p>
                </div>
                <p className={styles.val}>5</p>
              </div>
            </NavLink>
          </li>
        </ul>
        <div className={styles.space}></div>
        <div className={styles.bottom}>
          {" "}
          <div className={styles.tile}>
            <div className={styles.name}>
              <FaCircleInfo className={styles.icon} />
              <p className={styles.head}>{Strings.NAVBAR_HELP}</p>
            </div>
          </div>{" "}
          <div className={styles.tile}>
            <div className={styles.name}>
              <FaBars className={styles.icon} />
              <p className={styles.head}>{Strings.NAVBAR_MORE}</p>
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
          <h2 className={styles.heading}>{Strings.NAVBAR_TITLE}</h2>
          <FaRegHeart className={styles.menu} />
        </div>
      )}
    </div>
  );
}

export default NavigationBar;
