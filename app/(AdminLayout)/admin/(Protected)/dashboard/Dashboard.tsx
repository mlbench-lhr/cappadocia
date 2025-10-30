"use client";

// Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Users,
  Sprout,
  Trophy,
  ChevronDown,
  Triangle,
  User,
  Newspaper,
  View,
  Eye,
} from "lucide-react";
import Image from "next/image";
import greenGraphLine from "@/public/green graph line.svg";
import redGraphLine from "@/public/red graph line.svg";

import LoginStatistics from "./LoginStatistics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartPieDonutText } from "./DonutChart";
import { ChartAreaGradient } from "./AreaChart";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setBlogsCompletion, setOverview } from "@/lib/store/slices/adminSlice";
import moment from "moment";
import { SimpleBarChart } from "./SimpleBarChart";

/** Simple sparkline (no external libs). Stroke uses currentColor. */

function Sparkline({ points }: { points: number[] }) {
  const w = 180;
  const h = 48;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(1, max - min);
  const stepX = w / (points.length - 1);

  const d = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Types
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  sinceLabel?: string;
  trend: number;
  trendColorVar: string;
  lineColorVar: string;
  points: number[];
  isLoading?: boolean;
}

interface UserData {
  avatar?: string;
  createdAt: string;
  email: string;
  id: string;
  fullName: string;
}

// Loading skeleton component
const StatCardSkeleton: React.FC = () => (
  <div
    className="flex justify-between items-center p-5 md:p-6 border rounded-2xl bg-white animate-pulse"
    style={{ borderColor: "rgba(0,0,0,0.06)" }}
  >
    <div className="flex-1 pr-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="mt-4">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
    <div className="flex flex-col justify-center items-end min-w-[140px] sm:min-w-[180px]">
      <div className="w-[140px] sm:w-[180px] h-14 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
    </div>
  </div>
);

// Chart skeleton component
const ChartSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

// Users list skeleton component
const UsersListSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-3 p-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Components
const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  sinceLabel = "Since Last Month",
  trend,
  trendColorVar,
  lineColorVar,
  points,
  isLoading = false,
}) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <div
      className="w-full flex justify-between items-end p-5 md:p-[16px] border rounded-2xl bg-whit hover:shadow-md transition-shadow"
      style={{
        borderColor: "rgba(0,0,0,0.06)",
      }}
    >
      {/* LEFT: icon + text */}
      <div className="pr-4 w-fit">
        <div className="flex justify-center items-center rounded-full w-10 h-10">
          <div className="text-primary">{icon}</div>
        </div>

        <div className="w-full ">
          <div className="mt-[17px] text-[14.7px] font-medium w-full flex justify-between items-end">
            <span>{title}</span>
          </div>
          <div className="mt-[8px] font-[600] text-[34px] leading-[34px]">
            {value}
          </div>
          <div className="mt-[12px] text-[14px] text-gray-400">
            {sinceLabel}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-[50px] items-end w-fit">
        {trendColorVar === "#B32053" ? (
          <Image
            src={greenGraphLine}
            width={80}
            height={22}
            alt=""
            className="h-[22px] w-[80px]"
          />
        ) : (
          <Image
            src={redGraphLine}
            width={80}
            height={22}
            alt=""
            className="h-[22px] w-[80px]"
          />
        )}
        <div
          className="flex items-center mt-2 text-sm font-semibold justify-start"
          style={{ color: trendColorVar }}
        >
          <span>{trend}%</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="8"
            viewBox="0 0 15 8"
            fill="none"
          >
            <path
              d="M7.62812 7.80511L14.6492 0.784058L0.60707 0.784059L7.62812 7.80511Z"
              fill={trendColorVar}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const UserCard: React.FC<{ user: UserData }> = ({ user }) => {
  // Generate a default avatar if none provided
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.fullName
  )}&background=2F65A7&color=fff&size=40`;

  return (
    <div className="flex items-center space-x-3 py-3 hover: rounded-xl transition-colors">
      <Image
        src={user.avatar || defaultAvatar}
        alt={user.fullName}
        className="w-10 h-10 rounded-full object-cover"
        onError={(e) => {
          e.currentTarget.src = defaultAvatar;
        }}
        width={40}
        height={40}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {user.fullName}
        </p>
        <p className="text-sm text-gray-500 truncate">{user.email}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const overview = useAppSelector((s) => s.admin.overview);
  const blogsCompletion = useAppSelector((s) => s.admin.blogsCompletion);
  const dispatch = useAppDispatch();
  const [latestUsers, setLatestUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  console.log("overview---------", overview);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const overview = await axios.get("/api/admin/visits-summary");
        dispatch(setOverview(overview.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading2(true);
        const blogsCompletion = await axios.get(
          `/api/admin/dashboard/blog-completion?range=${selectedPeriod}`
        );
        dispatch(setBlogsCompletion(blogsCompletion.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading2(false);
      }
    };

    // fetchData();
  }, [selectedPeriod]);

  const fetchLatestUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await fetch("/api/admin/users?limit=6", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLatestUsers(data.users);
    } catch (err) {
      console.error("Error fetching latest users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    // fetchLatestUsers();
  }, []);

  const handlePeriodChange = (e: string) => {
    setSelectedPeriod(e);
  };

  return (
    <div className="min-h-screen w-full pb-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="title-heading">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <StatCard
            icon={<Newspaper color="#B32053" />}
            title="Total Blogs"
            value={overview?.blogs?.total}
            trend={overview?.blogs?.percentageChange}
            trendColorVar={overview?.blogs?.incremented ? "#B32053" : "#BA1A1A"}
            lineColorVar={overview?.blogs?.incremented ? "#B32053" : "#BA1A1A"}
            points={[3]}
            isLoading={loading}
          />
          <StatCard
            icon={<Eye color="#B32053" />}
            title="Blog Views"
            value={overview?.blog?.total}
            trend={overview?.blog?.percentageChange}
            trendColorVar={overview?.blog?.incremented ? "#B32053" : "#BA1A1A"}
            lineColorVar={overview?.blog?.incremented ? "#B32053" : "#BA1A1A"}
            points={[3]}
            isLoading={loading}
          />
          <StatCard
            icon={<View color="#B32053" />}
            title="Website Views"
            value={overview?.app?.total}
            trend={overview?.app?.percentageChange}
            trendColorVar={overview?.app?.incremented ? "#B32053" : "#BA1A1A"}
            lineColorVar={overview?.app?.incremented ? "#B32053" : "#BA1A1A"}
            points={[3]}
            isLoading={loading}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 h-[400px] pb-10">
          {/* Total Annotations Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            {loading2 ? <ChartSkeleton /> : <ChartAreaGradient />}
          </div>

          {/* Latest Added Users */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 bg-">
            {usersLoading ? (
              <UsersListSkeleton />
            ) : (
              <>
                <ChartPieDonutText />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
