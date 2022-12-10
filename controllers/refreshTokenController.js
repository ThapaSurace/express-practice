const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  //check if there is cookies...then agian check if that has jwt property
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden
  
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECERET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403); // forbidden
      // Object.values() returns an array containing all the enumerable property values of the given object. 
      const roles = Object.values(foundUser.roles);
      
      // if everything is ok, create new access token
      const accessToken = jwt.sign(
        {
          "userInfo": {
            "username": decoded.username,
            "roles": roles,
          },
        },
        process.env.ACCESS_TOKEN_SECERET,
        {
          expiresIn: "100s",
        }
      );
      res.json({ roles,accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
