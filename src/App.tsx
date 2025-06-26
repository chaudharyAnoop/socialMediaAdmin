import { AppRouter } from "./pages/AppRouter";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.nav}>
      <div className={styles.main}>
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
