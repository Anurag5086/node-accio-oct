const cron = require("node-cron");
const Blog = require("../models/Blog");

const cleanUpBin = () => {
  cron.schedule(
    "0 0 1 * * *",
    async () => {
      console.log("cron is running");

      const deletedBlogs = await Blog.find({ isDeleted: true });

      if (deletedBlogs.length > 0) {
        deletedBlogs.forEach(async (blog) => {
          const diff =
            (blog.deletionDateTime - blog.creationDateTime) /
            (1000 * 60 * 60 * 24);

          if (diff >= 30) {
            try {
              await Blog.findByIdAndDelete(blog._id);
            } catch (err) {
              console.log(err);
            }
          }
        });
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports = { cleanUpBin };
