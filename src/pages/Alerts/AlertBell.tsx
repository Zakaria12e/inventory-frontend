import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

interface AlertData {
  _id: string;
  productName: string;
  message: string;
  createdAt: string;
  seen: boolean;
}

export default function AlertBell() {
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);
  const [visibleAlerts, setVisibleAlerts] = useState<AlertData[]>([]);

  // Fetch alerts function
  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_URL}/alerts`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      const alerts: AlertData[] = res.data;

      // Only unseen alerts for bell count & temporary popup
      const unseenAlerts = alerts.filter(a => !a.seen);
      setAlertCount(unseenAlerts.length);
      setVisibleAlerts(unseenAlerts.slice(0, 3));

      // Auto-hide temporary popup after 6 seconds
      setTimeout(() => setVisibleAlerts([]), 6000);
    } catch (err) {
      console.error("Alert fetch error", err);
    }
  };

  // Initial fetch + polling every 10 seconds
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // 10 sec polling
    return () => clearInterval(interval);
  }, []);

  // Handle click on bell
  const handleClick = () => {
    navigate("/dashboard/alerts");
    setAlertCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="relative p-2 rounded-full hover:bg-muted transition"
      >
        <Bell className="h-5 w-5" />
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white font-bold">
            {alertCount}
          </span>
        )}
      </button>

      {/* Temporary popup for new alerts */}
      <div className="absolute top-10 right-0 w-64 z-50">
        <AnimatePresence>
          {visibleAlerts.map(alert => (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-2 p-3 rounded-md shadow-lg bg-background border text-sm"
            >
              <p className="font-semibold">{alert.productName}</p>
              <p className="text-muted-foreground">{alert.message}</p>
              <p className="text-[10px] mt-1">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
