import {
  IonContent,
  IonPage,
  IonSlides,
  IonSlide,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToast,
} from "@ionic/react";
import React, { Component } from "react";
import { arrowDownCircleOutline } from "ionicons/icons";
import { Downloader, NotificationVisibility } from "@ionic-native/downloader";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import getPhotos from "../services/getPhotos";
import "./Home.css";

const { StatusBar } = Plugins;

class Home extends Component {
  constructor() {
    super();
    this.state = {
      photos: [],
      counter: 1,
      toast: false,
    };
    this.slider = React.createRef();

    StatusBar.setStyle({
      style: StatusBarStyle.Dark,
    });
    // Display content under transparent status bar (Android only)
    StatusBar.setOverlaysWebView({
      overlay: true,
    });
  }

  componentDidMount = () => {
    getPhotos(1)
      .then(({ data }) => this.setState({ photos: data.results }))
      .catch((err) => console.log(err));
  };

  fetchWallpapers = async (e) => {
    let { counter, photos } = this.state;
    counter += 1;

    const { data } = await getPhotos(counter);
    const newSlides = data.results.map((photo) => {
      return `
        <ion-slide>
          <div class="wallpaper-container">
            <div
            class="wallpaper"
              style='background-image: url("${photo.urls.regular}")'
            ></div>
          </div>
        </ion-slide>
      `;
    });
    this.setState({ counter: counter, photos: [...photos, ...data.results] });
    this.slider.current
      .getSwiper()
      .then((slider) => {
        slider.appendSlide(newSlides);
        this.slider.current.update();
      })
      .catch((err) => console.log(err));
  };

  download = async () => {
    const idx = await this.slider.current.getActiveIndex();
    const url = this.state.photos[idx].urls.raw;

    var request = {
      uri: url,
      title: "hdwallpaper",
      description: "",
      mimeType: "",
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: "Downloads",
        subPath: this.state.photos[idx].id + ".jpeg",
      },
    };
    Downloader.download(request)
      .then((location) => {
        this.setState({ toast: true });
      })
      .catch((error) => {
        if (error === "PERMISSION DENIED") {
          alert(
            "Please provide Storage permission. Enable from Settings->Apps->Hd Wallpaper->Permissions"
          );
        } else {
          alert(JSON.stringify(error));
        }
      });
  };

  render() {
    const { photos, toast } = this.state;
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
                    <div className="wallpaper-container">
                      <div
                        className="wallpaper"
                        style={{
                          backgroundImage: `url('${photo.urls.regular}')`,
                        }}
                      ></div>
                    </div>
                  </IonSlide>
                );
              })}
            </IonSlides>
            <IonToast
              isOpen={toast}
              message={`Downloaded`}
              position="bottom"
              color="dark"
              buttons={[
                {
                  text: "OK",
                  role: "cancel",
                  handler: () => this.setState({ toast: false }),
                },
              ]}
            />
            <IonFab
              vertical="bottom"
              horizontal="center"
              onClick={() => this.download()}
            >
              <IonFabButton className="fab">
                <IonIcon icon={arrowDownCircleOutline} />
              </IonFabButton>
            </IonFab>
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

export default Home;
