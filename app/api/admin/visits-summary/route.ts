import connectDB from "@/lib/mongodb/connection";
import Blog from "@/lib/mongodb/models/Blog";
import Visits from "@/lib/mongodb/models/Visits";

export async function GET() {
  await connectDB();

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toISOString()
    .slice(0, 7); // YYYY-MM

  try {
    // ----------- APP & BLOG PAGE STATS -----------
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
      const currentTotal = current.find((c) => c._id === p)?.total || 0;
      const lastTotal = last.find((c: any) => c._id === p)?.total || 0;

      const change =
        lastTotal === 0 ? 100 : ((currentTotal - lastTotal) / lastTotal) * 100;

      summary[p] = {
        total: currentTotal,
        percentageChange: Math.abs(Number(change.toFixed(2))),
        incremented: currentTotal >= lastTotal,
      };
    });

    // ----------- BLOG COLLECTION STATS (CMS POSTS) -----------
    const currentMonthBlogs = await Blog.aggregate([
      {
        $match: {
          createdAt: { $regex: `^${currentMonth}` },
        },
      },
      { $count: "total" },
    ]);
    console.log("currentMonthBlogs-------", currentMonthBlogs);

    const lastMonthBlogs = await Blog.aggregate([
      {
        $match: {
          createdAt: { $regex: `^${lastMonth}` },
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
      total: currentBlogsCount,
      percentageChange: Math.abs(Number(blogsChange.toFixed(2))),
      incremented: currentBlogsCount >= lastBlogsCount,
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
