const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = { cloudinary };


// exports.uploader = async (path) => {
//   console.log(path);
//   try {
//     console.log("1");

//     const image = await cloudinary.uploader.upload(
//       path,
//       { resource_type: "image", folder: "Images" },
//       async (err, result) => {
//         if (err) {
//           return null;
//         } else {
//           console.log(result);
//           return result;
//         }
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };
