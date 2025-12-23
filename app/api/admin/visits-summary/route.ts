import connectDB from "@/lib/mongodb/connection";
import Blog from "@/lib/mongodb/models/Blog";
import Booking from "@/lib/mongodb/models/booking";
import User from "@/lib/mongodb/models/User";
import Visits from "@/lib/mongodb/models/Visits";

export async function GET() {
  await connectDB();

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toISOString()
    .slice(0, 7); // YYYY-MM

  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  try {
    const allTimeVisits = await Visits.aggregate([
      {
        $group: {
          _id: "$path",
          total: { $sum: "$count" },
        },
      },
    ]);
    const current = await Visits.aggregate([
      {
        $match: {
          date: { $regex: `^${currentMonth}` },
        },
      },
      {
        $group: {
          _id: "$path",
          total: { $sum: "$count" },
        },
      },
    ]);

    const last = await Visits.aggregate([
      {
        $match: {
          date: { $regex: `^${lastMonth}` },
        },
      },
      {
        $group: {
          _id: "$path",
          total: { $sum: "$count" },
        },
      },
    ]);

    const summary: Record<
      string,
      { total: number; percentageChange: number; incremented: boolean }
    > = {};

    const paths = ["app", "blog"];

    paths.forEach((p) => {
      const allTimeTotal = allTimeVisits.find((c) => c._id === p)?.total || 0;
      const currentTotal = current.find((c) => c._id === p)?.total || 0;
      const lastTotal = last.find((c) => c._id === p)?.total || 0;

      const change =
        lastTotal === 0 ? 100 : ((currentTotal - lastTotal) / lastTotal) * 100;

      summary[p] = {
        total: allTimeTotal,
        percentageChange: Math.abs(Number(change.toFixed(2))),
        incremented: currentTotal >= lastTotal,
      };
    });

    // ----------- BLOG COLLECTION STATS (CMS POSTS) -----------
    const allTimeBlogs = await Blog.countDocuments();
    const currentMonthBlogs = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
        },
      },
      { $count: "total" },
    ]);
    console.log("currentMonthBlogs-------", currentMonthBlogs);

    const lastMonthBlogs = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
        },
      },
      { $count: "total" },
    ]);

    const currentBlogsCount = currentMonthBlogs[0]?.total || 0;
    const lastBlogsCount = lastMonthBlogs[0]?.total || 0;

    const blogsChange =
      lastBlogsCount === 0
        ? 100
        : ((currentBlogsCount - lastBlogsCount) / lastBlogsCount) * 100;

    summary["blogs"] = {
      total: allTimeBlogs,
      percentageChange: Math.abs(Number(blogsChange.toFixed(2))),
      incremented: currentBlogsCount >= lastBlogsCount,
    };
    // ----------- USERS STATS -----------
    const allTimeUsers = await User.countDocuments();
    const currentMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
    });

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
    });

    const usersChange =
      lastMonthUsers === 0
        ? 100
        : ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;

    summary["users"] = {
      total: allTimeUsers,
      percentageChange: Math.abs(Number(usersChange.toFixed(2))),
      incremented: currentMonthUsers >= lastMonthUsers,
    };
    // ----------- VENDORS STATS -----------
    const allTimeVendors = await User.countDocuments({
      role: "vendor",
    });
    const currentMonthVendors = await User.countDocuments({
      role: "vendor",
      createdAt: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
    });

    const lastMonthVendors = await User.countDocuments({
      role: "vendor",
      createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
    });

    const vendorsChange =
      lastMonthVendors === 0
        ? 100
        : ((currentMonthVendors - lastMonthVendors) / lastMonthVendors) * 100;

    summary["vendors"] = {
      total: allTimeVendors,
      percentageChange: Math.abs(Number(vendorsChange.toFixed(2))),
      incremented: currentMonthVendors >= lastMonthVendors,
    };

    // ----------- BOOKINGS STATS -----------
    const allTimeBookings = await Booking.countDocuments();
    const currentMonthBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
    });

    const lastMonthBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
    });

    const bookingsChange =
      lastMonthBookings === 0
        ? 100
        : ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) *
          100;

    summary["bookings"] = {
      total: allTimeBookings,
      percentageChange:
        allTimeBookings > 0 ? Math.abs(Number(bookingsChange.toFixed(2))) : 0,
      incremented: currentMonthBookings >= lastMonthBookings,
    };

    // ----------- RETURN RESPONSE -----------
    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error fetching summary" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
