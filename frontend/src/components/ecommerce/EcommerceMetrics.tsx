import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import axiosInstance from "../../utils/axiosInstance"; // Remplace par ton instance Axios

export default function EcommerceMetrics() {
  const [userCount, setUserCount] = useState<number>(0);
  const [talkCount, setTalkCount] = useState<number>(0);
  const [salleCount, setSalleCount] = useState<number>(0); // Nouvel état pour le nombre de salles
  const [roleCount, setRoleCount] = useState<number>(0); // Nouvel état pour le nombre de rôles

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupère le nombre d'utilisateurs
        const userResponse = await axiosInstance.get("/utilisateurs/");
        setUserCount(userResponse.data.length); // Assumes the response is an array of users

        // Récupère le nombre de plannings
        const talkResponse = await axiosInstance.get("/plannings/");
        setTalkCount(talkResponse.data.length); // Assumes the response is an array of plannings

        // Récupère le nombre de salles
        const salleResponse = await axiosInstance.get("/salles/");
        setSalleCount(salleResponse.data.length); // Assumes the response is an array of salles

        // Récupère le nombre de rôles
        const roleResponse = await axiosInstance.get("/roles/");
        setRoleCount(roleResponse.data.length); // Assumes the response is an array of roles

      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start - Utilisateurs --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {userCount} {/* Dynamically display the user count */}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End - Utilisateurs --> */}

      {/* <!-- Metric Item Start - Plannings --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {talkCount} {/* Dynamically display the talk count */}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End - Plannings --> */}

      {/* <!-- Metric Item Start - Salles --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Rooms
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {salleCount} {/* Dynamically display the salle count */}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End - Salles --> */}

      {/* <!-- Metric Item Start - Rôles --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Roles
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {roleCount} {/* Dynamically display the role count */}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End - Rôles --> */}

    </div>
  );
}
