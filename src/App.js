import React, { Component } from "react";
import Particle from "./Components/Particles/Particles";
import Navigation from "./Components/Navigation/Navigation";
import Signin from "./Components/Signin/Signin";
import Register from "./Components/Register/Register";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import "./App.css";

const initialState = {
  input: "", //It also stored the image url but after click on submit/detect button so that image load after submitting.
  imageUrl: "", //stored the image url which we put in input box
  box: [], //Stored the left,right,top,bottom corner position of the image
  route: "signin", //route -> It tells which page to be displayed initially it is on sign in page based on click it will change the route to register,home
  isSignedin: false, //State of the user whether it is signe in or not.Initially it is false when someone signed in then it will set to true
  user: {
    //User information
    id: "", //Unique id generated after every Registration. This id is of the current logged in user
    name: "", //Name of the currently logged user
    email: "", //Email of the currently logged user
    entries: 0, //Entries means how many time a user detect the images
    joined: "", //Date and time of joined a user
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  //Loading the users data in state after signin or register which get the data from backend
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  //calculating face location it gets data from clarifai api in (onButtonSibmit) function after submitting the url
  //and it calculate the left right top bottom column.
  // calculateFaceLocation = (data) => {
  //   console.log(data);
  //   const clarifaiFace = data.outputs[0].data.clusters[0].projection;
  //   // data.outputs[0].data.regions[0].region_info.bounding_box;
  //   const image = document.getElementById("inputimage");
  //   console.log(image.width);
  //   console.log(image.height);
  //   const width = Number(image.width);
  //   const height = Number(image.height);
  //   return {
  //     // leftCol: clarifaiFace.left_col * width,
  //     // rightCol: width - clarifaiFace.right_col * width,
  //     // topRow: clarifaiFace.top_row * height,
  //     // bottomRow: height - clarifaiFace.bottom_row * height,
  //     leftCol: clarifaiFace[0] * width,
  //     rightCol: width * 0.7 + clarifaiFace[0] * width,
  //     topRow: clarifaiFace[1] * height,
  //     bottomRow: height * 0.7 + clarifaiFace[1] * height,
  //   };
  // };

  //using my own method
  calculateFaceLocation = (data) => {
    console.log(data[0]);

    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    //testing
    const face = data[0];
    const top = face.y + "px";
    const right = 500 - (face.x + face.width) + "px";
    const bottom = 500 - (face.y + face.height) + "px";
    const left = face.x + "px";

    console.log("topRow => ", face.y, " = ", top);
    console.log(
      "rightCol => ",
      width,
      " - ",
      face.x,
      " + ",
      face.width,
      " = ",
      right
    );
    console.log(
      "bottomRow = ",
      height,
      " - ",
      face.y,
      " + ",
      face.height,
      " = ",
      bottom
    );
    console.log("leftCol = ", face.x, " = ", left);
    console.log(width);
    console.log(height);

    return {
      topRow: face.y,
      rightCol: width - (face.x + face.width),
      bottomRow: height - (face.y + face.height),
      leftCol: face.x,
    };
  };

  calculateMultipleFaceLocation = (data) => {
    const image = document.getElementById("inputimage");
    const imagewidth = Number(image.width);
    const imageheight = Number(image.height);

    const results = data.outputs.map((face, index) => {
      const { x, y, width, height } = face;
      const top = y + "px";
      const right = imagewidth - (x + width) + "px";
      const bottom = imageheight - (y + height) + "px";
      const left = x + "px";
      return { top, right, bottom, left };
    });
    return results;
  };
  //This function set the box data that is leftCol,RightCol,topRow,bottomRow which we got from
  //(calculateFaceLocation) function. It gets called in (onButtomSubmit) function
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };
  //Whenever input changes in (ImageLinkForm) component it set the input data in state. It gets called in
  //(ImageLinkForm)
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  //Whenever we submit the form in (ImageLinkForm) by clicking it on detect button it gets called and give the response
  //by sending the input data in backend image route and get the face dimensions to the (calculateFaceLocation) function
  //and also send the id to backend image route to update the entries in datbase and set the updated entries in state.
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    console.log(initialState.imageUrl);
    fetch("http://localhost:3000/imageUrl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.outputs) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => {
              response.json();
            })
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch((err) => {
              console.log("error");
            });
        }
        this.displayFaceBox(this.calculateMultipleFaceLocation(response));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //When route changes means when we click on register or signin it set the state of isSignedin,route and
  //show that page on website.It gets called in (Navigation,signIn,register)
  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState); //When we signout then we need to clear the state/set to initial state.
    } else if (route === "home") {
      this.setState({ isSignedin: true });
    }
    this.setState({ route: route });
  };
  render() {
    const { imageUrl, box, route, isSignedin } = this.state;
    return (
      <div className="App">
        <Particle />
        <Navigation
          isSignedin={isSignedin}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
              imageHeight={this.state.imageHeight}
              imageWidth={this.state.imageWidth}
            />
          </div>
        ) : route === "signin" ? (
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}
export default App;
