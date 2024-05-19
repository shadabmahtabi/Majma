var express = require("express");
var router = express.Router();
const passport = require("passport");
const { use } = require("passport");
const userModel = require("./users.js");
const postModel = require("./post.js");
const commnentModel = require("./comment.js");

// for GridFs
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
// for GridFs

//  ------------------- Email Validation -------------------
const checkEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// ------------------ Sign In With Google Starts Here ------------------

var GoogleStrategy = require("passport-google-oidc");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["email", "profile"],
    },
    async function verify(issuer, profile, cb) {
      var User = await userModel.findOne({ email: profile.emails[0].value });
      if (User) {
        return cb(null, User);
      } else {
        var newUser = await userModel.create({
          username: profile.displayName,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        newUser.save();
        return cb(null, newUser);
      }
    }
  )
);

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/moreDetails", function (req, res, next) {
  res.render("moreDetails", { user: req.user });
});

// ------------------ Sign In With Google Ends Here ------------------
// ------------------ Passport Login Starts Here ------------------

var localStrategy = require("passport-local");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { sendmail } = require("../utils/nodemailer.js");
const otpModel = require("./otpModel.js");
// const { url } = require('inspector');
passport.use(
  new localStrategy(function (username, password, done) {
    userModel.authenticate()(username, password, function (err, user, info) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }
      return done(null, user);
    });
  })
);

router.get("/login", function (req, res, next) {
  if (!req.user) {
    return res.render("login", { title: "Majma | Login Page" });
  }
  res.redirect("back");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (req, res, next) {}
);

router.post("/register", function (req, res, next) {
  var newUser = new userModel({
    username: req.body.username.trim(),
    name: req.body.name.trim(),
    email: req.body.email.toLowerCase().trim(),
  });

  userModel.register(
    newUser,
    req.body.password,
    function (err, registeredUser) {
      if (err) {
        return next(new ErrorHandler(`${err.message}`, 400));
      }

      // If registration is successful, authenticate the user
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  );
});

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

// ------------------ Passport Login Ends Here ------------------
// ------------------ upload Storage starts here ------------------

// GridFs Storage

const url = process.env.MONGODB_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
  });

const conn = mongoose.connection;
let gfs;
let gridFsBucket;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("majmaUploads");
  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "majmaUploads",
  });
});

const gridStorage = new GridFsStorage({
  url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(12, (err, buf) => {
        if (err) {
          console.log(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "majmaUploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const maxSize = 5 * 1024 * 1024;

const upload = multer({
  storage: gridStorage,
  fileFilter: function fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Only accept .jpg, .png & .jpeg formats are allowed!")
      );
    }
  },
  limits: { fileSize: maxSize },
});

// ------------------ upload Storage ends here ------------------
// ------------------ POST routes ------------------

router.post("/upload", upload.single("image"), async function (req, res, next) {
  let user = req.user;
  let file = req.file;
  // console.log(file);
  if (file) {
    let post = await postModel.create({
      user: user._id,
      image: file.filename,
      imageId: file.id,
      desc: req.body.desc,
    });
    await user.posts.push(post._id);
    await user.save();
    res.redirect("back");
    // console.log(user);
    // console.log(post);
  } else {
    return res.redirect("back");
  }
});

router.post("/editProfile", upload.single("file"), async (req, res, next) => {
  let user = req.user;
  let file = req.file;
  if (file) {
    let post = await postModel.create({
      user: user._id,
      image: file.filename,
      imageId: file.id,
      desc: "Hey, I have changed my profile pic 😍😍",
    });
    await user.posts.push(post._id);
    userModel.findOne({ username: req.session.passport.user }).then((u) => {
      u.profilePic = file.filename;
      u.save();
    });
    await user.save();
    res.redirect("back");
  } else {
    return res.redirect("back");
  }
});

// ajax call for search

router.post("/getUsers", isLoggedIn, async (req, res, next) => {
  let user = req.body.username.trim();
  let search = await userModel
    .find({ name: { $regex: new RegExp("^" + user + ".*", "i") } })
    .exec(); // '^' => used for finding on the basis of 1st letter {'^'+payload+'.*','i'}. To make it as finding between the words write as {payload+'.*','i'}

  // search = search.slice(0, 10);
  res.send({ user: search });
});

// ajax call ends

router.post("/edit", async (req, res, next) => {
  try {
    const { name, bio, gender, age, email, mobileNumber, username } = req.body;

    gender.charAt(0).toUpperCase() + gender.slice(1);
    if (name) req.user.name = name.trim();
    if (bio) req.user.bio = bio.trim();
    if (gender) req.user.gender = gender.trim();
    if (age) req.user.age = age.trim();
    if (username) req.user.username = username.trim();
    if (mobileNumber && mobileNumber.length === 10)
      req.user.mobileNumber = mobileNumber.trim();
    if (email) req.user.email = email.trim();

    await req.user.save();
    res.redirect("back");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.post("/likeUnlike", (req, res, next) => {
  postModel.findOne({ _id: req.body.postId }).then((post) => {
    if (post.likes.indexOf(req.user._id) != -1) {
      post.likes.splice(post.likes.indexOf(req.user._id), 1);
      post.save().then(() => {
        res.send({ post });
      });
    } else {
      post.likes.push(req.user._id);
      post.save().then(() => {
        res.send({ post });
      });
    }
  });
});

router.post("/comment/:id", async (req, res, next) => {
  let data = req.body.comment.trim();

  if (data === "") {
    res.redirect("back");
  } else {
    let post = await postModel.findOne({ _id: req.params.id });
    let comment = await commnentModel.create({
      userId: req.user._id,
      postId: req.params.id,
      data: data,
    });

    post.comments.push(comment._id);
    await post.save();
    res.redirect("back");

    // await comment.populate('userId');
    // console.log(comment);
    // res.send({ comment });
  }
});

router.post("/createBlog", isLoggedIn, async (req, res) => {
  let user = req.user;

  if (req.body.blog.trim() === "") {
    res.send("Nothing Entered !!");
  }

  let post = await postModel.create({
    blog: req.body.blog.trim(),
    user: user._id,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("back");
});

/**
 * @method  POST
 * @route /changepassword
 * @access  Public
 * @desc  This route is used to verify otp and change password
 */
router.post("/changepassword", async (req, res, next) => {
  try {
    // Extract oldPassword and newPassword from request body
    const { oldPassword, newPassword } = req.body;

    // Check if the user is authenticated and request contains necessary data
    if (!req.isAuthenticated || !oldPassword || !newPassword) {
      throw new ErrorHandler("Invalid request", 400);
    }

    // Authenticate user with old password
    req.user.authenticate(oldPassword, async (err, model, passwordError) => {
      // Handle authentication errors
      if (passwordError)
        return next(new ErrorHandler("Incorrect password", 401));

      // Change password if authentication successful
      req.user.changePassword(oldPassword, newPassword, (err) => {
        // Handle changePassword errors
        return err
          ? next(new ErrorHandler(err.message, 500))
          : res.status(200).redirect("back");
      });
    });
  } catch (error) {
    // Handle general errors
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * @method  POST
 * @route /changepassword
 * @access  Public
 * @desc  This route is used to verify email, search user and send mail with OTP
 */
router.post("/checkUser/:type", async (req, res, next) => {
  try {
    const { credentials } = req.body;
    const type = req.params.type;
    let user;

    if (type === "deleteAccount") {
      await new Promise((resolve, reject) => {
        req.user.authenticate(credentials, (err, model, passwordError) => {
          if (err) {
            return reject(new ErrorHandler(err.message, 500));
          } else if (passwordError) {
            return next(new ErrorHandler(passwordError.message, 401));
          } else if (model) {
            user = { _id: model._id, email: model.email };
            resolve();
          } else {
            return reject(new ErrorHandler("User not found", 204));
          }
        });
      });
    } else {
      user = await userModel
        .findOne({
          $or: [{ email: credentials }, { username: credentials }],
        })
        .select("email")
        .exec();
    }

    if (user) {
      await sendmail(user.email, type, res, next);
    } else {
      return res.status(204).json({
        message: "User not found with provided username or email",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * @method  POST
 * @route /forgotPassword
 * @access  Public
 * @desc  This route is used to reset password
 */
router.post("/forgetPassword", async (req, res, next) => {
  try {
    // Destructure the request body
    const { credentials, otp, newPassword } = req.body;

    // Find the user by email or username
    const user = await userModel
      .findOne({ $or: [{ email: credentials }, { username: credentials }] })
      .exec();

    // If user not found, throw 404 error
    if (!user) {
      return next(
        new ErrorHandler("User not found with provided username or email", 404)
      );
    }

    // Find the OTP for the user's email
    const otpFromDB = await otpModel
      .findOne({ email: user.email, type: "forgetForm" })
      .exec();

    // If OTP not found, return 410 error
    if (!otpFromDB) {
      return res.status(410).json({ message: "OTP expired!" });
    }

    // If OTP does not match, return 400 error
    if (otpFromDB.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Set the new password for the user
    user.setPassword(newPassword, async (err) => {
      // Handle setPassword error
      if (err) {
        return next(new ErrorHandler(err.message, 500));
      }

      // Save the user and delete the OTP
      await Promise.all([user.save(), otpFromDB.deleteOne()]);

      // Redirect to login page upon successful password change
      return res.status(200).redirect("/login");
    });
  } catch (error) {
    // Pass the error to the error handler middleware
    return next(new ErrorHandler(error.message, 500));
  }
});

/**
 * @method  POST
 * @route /deleteAccount
 * @access  Public
 * @desc  This route is used to delete account
 */
router.post("/deleteAccount", async (req, res, next) => {
  try {
    // Get the user from the request body
    const {} = req.body;
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// ------------------ POST routes ------------------
// ------------------ GET routes ------------------

router.get("/settings", isLoggedIn, (req, res) => {
  let { name, username, email, mobileNumber, isDark, profilePic } = req.user;
  res.render("settings", {
    loggedInUser: { name, username, email, mobileNumber, isDark, profilePic },
  });
});

// Delete a post by ID
router.get("/delete/:id", isLoggedIn, async (req, res) => {
  let postId = req.params.id;
  let user = req.user; // Get the current logged-in user

  // Find the post by ID and populate the user field
  let post = await postModel.findOne({ _id: postId }).populate("user");

  // Iterate through the comments of the post and delete each one
  post.comments.map(async (item) => {
    await commnentModel.findOneAndDelete({ _id: item });
  });

  // Clear the comments array of the post and save it
  post.comments = [];
  await post.save();

  // Find the index of the post in the user's posts array and remove it
  user.posts.splice(user.posts.indexOf(post._id), 1);
  await user.save();

  // If the post is not a blog, check if the user's profile picture is the same as the post's image
  if (!post.blog) {
    if (user.profilePic === post.image) {
      // If so, set the user's profile picture to the default avatar and save
      user.profilePic = "default-avatar.png";
      await user.save();
    }

    // Delete the image from GridFS and delete the post
    await gridFsBucket.delete(new mongoose.Types.ObjectId(post.imageId));
    await postModel.findOneAndDelete({ _id: postId }, { new: true });
    return res.redirect(`/profile/${user.username}`);
  }

  // res.redirect(`/profile/${user.username}`);
  res.redirect("back");
});

router.get("/files", isLoggedIn, async (req, res) => {
  let files = await gfs.files.find().toArray();
  if (!files || files.length === 0) {
    res.send("No files found!");
  }

  res.send(files);
});

router.get("/posts", isLoggedIn, async (req, res) => {
  let posts = await postModel.find().populate("user");
  res.send(posts);
});

router.get("/images/:filename", async (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }).then((file) => {
    if (!file || file.length === 0) {
      console.log("No file found!");
    }
    // console.log(file);
    const readstream = gridFsBucket.openDownloadStreamByName(
      req.params.filename
    );
    readstream.pipe(res);
  });
});

// --------------- shuffle function ---------------
const shuffle = (arr) => {
  let currentIndex = arr.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
};
// ------------------------------------------------

/**
 * @method  GET
 * @route /
 * @access  Public
 * @desc  This route is used to show posts. This is Home Page.
 */
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const { _id: loggedInUserId } = req.user;

    const allUsers = await userModel.find().exec();
    const posts = await postModel
      .find({ user: { $ne: loggedInUserId } })
      .populate("user")
      .limit(10)
      .exec();
    const comments = await commnentModel.find().populate("userId").exec();

    const shuffledUsers = shuffle(allUsers.reverse());
    const shuffledPosts = shuffle(posts.reverse());

    res.render("home", {
      title: "Majma | Home Page",
      loggedInUser: req.user,
      allUsers: shuffledUsers,
      posts: shuffledPosts,
      comments,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @method  GET
 * @route /loadMorePosts
 * @access  Public
 * @desc  This route is used to load more posts.
 */
router.get("/loadMorePosts", isLoggedIn, async (req, res, next) => {
  try {
    const { _id: loggedInUserId } = req.user;
    const { page = 1, limit = 10 } = req.query; // Default to first page and 10 posts per page

    const posts = await postModel
      .find({ user: { $ne: loggedInUserId } })
      .populate("user")
      .limit(Number(limit)) // Convert limit to number
      .skip((page - 1) * limit)
      .exec();

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/progress", function (req, res, next) {
  res.render("progress");
});

router.get("/profile/:username", isLoggedIn, async function (req, res, next) {
  var user = await userModel
    .findOne({ username: req.params.username })
    .populate("posts")
    .populate({
      path: "following",
      model: "User",
      select: ["name", "_id", "profilePic", "username"],
    })
    .populate({
      path: "followers",
      model: "User",
      select: ["name", "_id", "profilePic", "username"],
    });
  // var {following} = await userModel.findOne({ _id: req.params.id }).populate("following");
  // var user = await userModel.findOne({ _id: req.params.id }).populate("posts");
  var sumLikes = [];
  user.posts.map((post) => {
    sumLikes.push(post.likes.length);
  });
  const totalLikes = sumLikes.reduce((partialSum, a) => partialSum + a, 0);
  // console.log(totalLikes);

  var sumComments = [];
  user.posts.map((post) => {
    sumComments.push(post.comments.length);
  });
  const totalComments = sumComments.reduce(
    (partialSum, a) => partialSum + a,
    0
  );

  // console.log(user);
  res.render("profile", {
    user,
    loggedInUser: req.user,
    totalLikes,
    totalComments,
  });
});

router.get("/follow/:id", isLoggedIn, async function (req, res, next) {
  var loggedInUser = req.user;
  var user = await userModel.findOne({ _id: req.params.id });
  if (user.followers.indexOf(loggedInUser._id) != -1) {
    user.followers.splice(user.followers.indexOf(loggedInUser._id), 1);
    loggedInUser.following.splice(loggedInUser.following.indexOf(user._id), 1);
    await loggedInUser.save();
    await user.save();
    res.redirect("back");
  } else {
    user.followers.push(loggedInUser._id);
    loggedInUser.following.push(user._id);
    await loggedInUser.save();
    await user.save();
    res.redirect("back");
  }
});

router.get("/comment/:id", isLoggedIn, async (req, res) => {
  let post = await postModel
    .findOne({ _id: req.params.id })
    .populate("user")
    .populate("comments");
  let comments = await commnentModel
    .find()
    .populate("userId")
    .populate("postId");
  // console.log(comments);
  // console.log('Post Below')
  // console.log(post)
  res.render("comment", {
    title: "Majma | Comment Page",
    loggedInUser: req.user,
    post,
    comments,
  });
});

router.get("/modeChanger/:n", isLoggedIn, async (req, res) => {
  let user = req.user;
  user.isDark = req.params.n;
  await user.save();
  res.redirect("back");
  // console.log(user);
});

router.get("/openChat", isLoggedIn, async (req, res) => {
  // var loggedInUser = await userModel.findOne({ username: req.params.username });
  var loggedInUser = req.user;
  // console.log(loggedInUser);
  res.render("openChat", { title: "Majma | OpenChat Page", loggedInUser });
});

router.get("/openChat/:username", isLoggedIn, async (req, res) => {
  var loggedInUser = await userModel.findOne({ username: req.params.username });
  // console.log(loggedInUser);
  // res.render("openChat", { title: "Majma | OpenChat Page", loggedInUser });
});

/**
 * @method  GET
 * @route /sendmail
 * @access  Public
 * @desc  This route is used to send a mail to the user
 */
router.get("/sendmail", async (req, res, next) => {
  try {
    sendmail(req.user.email, req, res, next);
  } catch (error) {
    return next(new ErrorHandler(error.message), 500);
  }
});

/**
 * @method  GET
 * @route /forgotPassword
 * @access  Public
 * @desc  This route is used to show forget password page
 */
router.get("/forgotPassword", (req, res, next) => {
  res.render("forgetPage", { title: "Majma | Forgot Password Page" });
});

// ------------------ GET routes ------------------

module.exports = router;
