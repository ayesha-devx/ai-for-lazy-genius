import User from '../models/User.js';
import Blog from '../models/Blog.js';

export const getAuthorProfile = async (req, res) => {
  try {
    const author = await User.findById(req.params.id)
      .select('name avatar profileImage bio followers following createdAt');

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const blogs = await Blog.find({ author: author._id, status: 'published' })
      .sort({ createdAt: -1 });

    const totalLikes = blogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);

    res.json({
      author,
      totalBlogs: blogs.length,
      totalLikes,
      followersCount: author.followers?.length || 0,
      recentBlogs: blogs.slice(0, 5) // Send top 5 recent blogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followAuthor = async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    const currentUserId = req.user._id;

    if (userToFollowId.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userToFollowId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add to followers and following
    if (!userToFollow.followers.includes(currentUserId)) {
      userToFollow.followers.push(currentUserId);
      await userToFollow.save();
    }

    if (!currentUser.following.includes(userToFollowId)) {
      currentUser.following.push(userToFollowId);
      await currentUser.save();
    }

    res.json({ message: "Successfully followed author", following: currentUser.following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowAuthor = async (req, res) => {
  try {
    const userToUnfollowId = req.params.id;
    const currentUserId = req.user._id;

    const userToUnfollow = await User.findById(userToUnfollowId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUserId.toString()
    );
    await userToUnfollow.save();

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollowId.toString()
    );
    await currentUser.save();

    res.json({ message: "Successfully unfollowed author", following: currentUser.following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrendingCreators = async (req, res) => {
  try {
    // 1. Find all users
    const users = await User.find().select('name avatar profileImage bio followers');
    
    // 2. We need to sort by followers, total likes, and total blogs.
    // For a real production app, we would aggregate this or cache it, 
    // but for now, we'll calculate it on the fly.
    
    const creatorsStats = await Promise.all(
      users.map(async (user) => {
        const blogs = await Blog.find({ author: user._id, status: 'published' });
        const totalLikes = blogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
        return {
          _id: user._id,
          name: user.name,
          avatar: user.profileImage || user.avatar,
          bio: user.bio,
          followersCount: user.followers?.length || 0,
          totalBlogs: blogs.length,
          totalLikes
        };
      })
    );

    // Sort priority: Followers -> Likes -> Blogs
    creatorsStats.sort((a, b) => {
      if (b.followersCount !== a.followersCount) {
        return b.followersCount - a.followersCount;
      }
      if (b.totalLikes !== a.totalLikes) {
        return b.totalLikes - a.totalLikes;
      }
      return b.totalBlogs - a.totalBlogs;
    });

    const topCreators = creatorsStats.slice(0, 10);
    res.json(topCreators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
