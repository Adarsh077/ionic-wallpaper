import Axios from "./Axios";

const getWallpaper = (counter) => {
  const params = {
    query: "space background",
    per_page: "5",
    page: counter,
    color: "black",
    orientation: "portrait",
  };
  return Axios.get("/search/photos", { params });
};

export default getWallpaper;
