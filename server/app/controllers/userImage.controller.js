const mongoose = require("mongoose");
const fs = require("fs");
const { cloudinary } = require("../utils/Cloudinary");

const db = require("../models");
const UserImages = db.userImages;
//to upload profile/gallery or any type of image
exports.uploadImage = async (req, res) => {
  try {
    console.log("first");

    const files = req.files[0];
    const { path } = files;
    console.log(path); //to upload 1 images
    const image = await cloudinary.uploader.upload(
      path,
      { resource_type: "image", folder: "Images" },
      async (err, result) => {
        if (err) {
          return res
            .status(404)
            .send("Error while uploading file to cloudinary" + err);
        }
        //to save details of image
        //  else {
        //   console.log(result);
        //   const img = new UserImages({
        //     publicId: result.public_id,
        //     url: result.secure_url,
        //     imgType: req.body.type,
        //     userId: req.userId,
        //   });
        //   await img.save();
        // }
      }
    );
    //remove files
    fs.unlinkSync(path);
    console.log(image);
    return res.status(200).send({
      message: "Image uploaded successfully",
      // id: image.public_id,
      // url: image.secure_url,
    });
  } catch (err) {
    res.status(404).send({ message: err });
  }
};
