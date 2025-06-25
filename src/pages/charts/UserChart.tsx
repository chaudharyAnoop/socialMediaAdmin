import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./charts.module.css";

export default function UserChart({ activeUsers, blockedUsers }) {
  const pieData = [
    { name: "Followers", value: activeUsers },
    { name: "Following", value: blockedUsers },
  ];

  const barData = [
    { category: "Followers", projects: activeUsers },
    { category: "Following", projects: blockedUsers },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Bar Chart: Project Categories */}
        <div className={styles.chart}>
          <h2>Projects by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projects" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Project Status */}
        <div className={styles.chart}>
          <h2>Project Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#f7b731"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
