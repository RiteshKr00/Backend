const { default: axios } = require("axios");
const photo_Upload_Url = process.env.photoupload_url;

module.exports = uploadImage = (path) => {
  
  const img = axios.post(photo_Upload_Url, {
    path: path,
  });
  // .then((res) => {
  //   console.log(res.data);
  // })
  // .catch((err) => console.log(err));
  return img;
};
