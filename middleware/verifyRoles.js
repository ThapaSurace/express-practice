const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // even if we have request we should have roles
    if (!req?.roles) return res.sendStaus(401);
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);

    // return true or false
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);

      if(!result) return res.sendStatus(401)
      next()
  };
};

module.exports = verifyRoles
