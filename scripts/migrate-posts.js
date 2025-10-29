import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

async function migratePosts() {
  try {
    await dbConnect();
    console.log("Connected to database");

    // Update all posts that don't have comments field
    const result = await Post.updateMany(
      { comments: { $exists: false } },
      { $set: { comments: "[]", views: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} posts`);
    console.log("Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migratePosts();
