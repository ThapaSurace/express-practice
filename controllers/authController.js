const User = require('../model/User');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: "Username and password are required." });
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWTs
    const accessToken = jwt.sign(
      {
        "userInfo": {
          "username": foundUser.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECERET,
      { expiresIn: "100s" }
    );
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECERET,
      { expiresIn: "1d" }
    );

    // saving refresh token with current user in database
      foundUser.refreshToken = refreshToken
      const result = await foundUser.save()
      console.log(result)

    //  http cookie to provide refresh token to client
    res.cookie("jwt", refreshToken, {
     // if cookie is http only ..it will not be avaliable to jS
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,  // 1 day
    }); //in production add secure:true

    // dont store this in local storage in forntend....save it to memory
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
