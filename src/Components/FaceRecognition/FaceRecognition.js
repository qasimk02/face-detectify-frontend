import React from "react";
import "./FaceRecognition.css";
import image from "./image.jpg";
const FaceRecognition = ({ imageUrl, box, width, height }) => {
  console.log("faceRcognition", box);
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          // src={image}
          // width="500px"
          width="auto"
          height="auto"
        />
        {/* <div
          className="bounding-box"
          style={{
            top: box.topRow + "px",
            right: box.rightCol + "px",
            bottom: box.bottomRow + "px",
            left: box.leftCol + "px",
          }}
        ></div> */}

        {/* for muliple images */}
        {box.map((face, index) => (
          <div
            key={index}
            className="bounding-box"
            style={{
              top: face.top,
              right: face.right,
              bottom: face.bottom,
              left: face.left,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
export default FaceRecognition;
