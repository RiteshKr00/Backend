const { default: axios } = require("axios");
module.exports = uploadImage = (path) => {
  //url to be replaced by env_variable
  const img = axios.post("http://localhost:8000/user/image/upload", {
    path: path,
  });
  // .then((res) => {
  //   console.log(res.data);
  // })
  // .catch((err) => console.log(err));
  return img;
};
