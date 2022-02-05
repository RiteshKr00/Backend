const db = require("../models");
const User = require("../models/user.model");
const Post = db.post;
const Friend = db.friend;
const Comment = db.comment;
exports.engagementMetrics = async (req, res) => {
  try {
    const user = req.userId;
    const { last } = req.body;
    const time = Date.now() - last * 86400000;
    const timeIso = new Date(time).toISOString();
    let likecount = 0;
    let commentcount = 0;
    //Liked post
    const postlike = await Post.find({
      postedBy: req.userId,
    }) //.populate("likeanalytics.userid")
      .select("likeanalytics");
    // console.log(postlike);

    const x = postlike.forEach((post) => {
      const out = post.likeanalytics.filter((userid) => {
        return userid.at.toISOString() > timeIso;
      });
      // console.log(out);
      if (out.length) {
        likecount += out.length;
      }
    });
    //Commented Post
    let result = postlike.map(({ _id }) => _id);
    console.log(result);
    const postcomment = await Comment.find({
      $and: [
        { postId: { $in: result } },
        {
          createdAt: {
            $gte: new Date(timeIso),
            // $lt: new Date("2023-07-03T00:00:00Z"),
          },
        },
      ],
    });
    commentcount = postcomment.length;
    const acceptedUser = await Friend.find({
      $and: [
        { $or: [{ senderId: req.userId }, { receiverId: req.userId }] },
        { status: 4 },
      ],
    });
    const friend = acceptedUser.length / 2;
    if (friend) {
      const engagement_rate = ((likecount + commentcount) / friend) * 100;
      const data = {
        likecount,
        commentcount,
        friend: friend,
        engagement_rate,
      };
      return res.success(
        `Engagement rate using formula Engagement = (Likes + Comments) / Friend x 100 in last ${last} days`,
        data
      );
    } else {
      return res.success("No friend to calculate engagement metrics");
    }
  } catch (err) {
    res.error(500, `${err}`, `${err} Something Went Wrong`);
  }
};
exports.mostLiked = async (req, res) => {
  try {
    const user = req.userId;
    //Liked post
    const mostliked = await Post.findOne({
      postedBy: req.userId,
    }).sort({ "likes.total": -1 });

    return res.success(`Most Likes Post`, mostliked);
  } catch (err) {
    res.error(500, `${err}`, `${err} Something Went Wrong`);
  }
};
