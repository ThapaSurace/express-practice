const allowedOrigins = require('./allowedOrigins');

// cross arigin resource sharing
// below array contains the site u want to give access your backend 
// localhost server are used while developing your application..later it can be removed

const corsOption = {
  origin: (origin, callback) => {
    // put or operator during development process, so our custom error dont
    // show every time we get GET undefined method in log file
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};

module.exports = corsOption