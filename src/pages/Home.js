import { IonContent, IonPage, IonSlides, IonSlide } from "@ionic/react";
import React, { Component } from "react";
import Axios from "../services/Axios";
import "./Home.css";
import DownloadIcon from "../assets/download.svg";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      photos: [],
      counter: 1,
    };
    this.slider = React.createRef();
  }

  componentDidMount = () => {
    const params = {
      query: "wallpaper",
      per_page: "3",
      color: "black",
      orientation: "portrait",
    };

    Axios.get("/search/photos", { params })
      .then(({ data }) => this.setState({ photos: data.results }))
      .catch((err) => console.log(err));
  };

  fetchWallpapers = (e) => {
    let { counter } = this.state;
    counter += 1;
    const params = {
      query: "wallpaper",
      per_page: "3",
      page: counter,
      color: "black",
      orientation: "portrait",
    };
    Axios.get("/search/photos", { params })
      .then(({ data }) => {
        this.setState({ counter: counter });
        this.slider.current
          .getSwiper()
          .then((slider) => {
            data.results.forEach((photo) => {
              slider.appendSlide(`
              <ion-slide>
                <div
                class="wallpaper"
                  style='background-image: url("${photo.urls.regular}")'
                ></div>
              </ion-slide>`);
            });
            this.slider.current.update();
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { photos } = this.state;
    console.log(photos);
    return (
      <IonPage>
        <IonContent>
          <div className="container">
            <IonSlides
              style={{ height: "100vh" }}
              ref={this.slider}
              onIonSlideReachEnd={this.fetchWallpapers}
            >
              {photos.map((photo, idx) => {
                return (
                  <IonSlide key={idx}>
                    <div
                      className="wallpaper"
                      style={{
                        backgroundImage: `url('${photo.urls.regular}')`,
                      }}
                    ></div>
                  </IonSlide>
                );
              })}
            </IonSlides>
            <div className="footer" onClick={this.download}>
              <div>
                <img src={DownloadIcon} alt="download" width="20" height="20" />
              </div>
              <h5>Download</h5>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

export default Home;
