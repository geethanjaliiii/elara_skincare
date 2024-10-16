 function setCookie(tokenName, token, maxAge, res) {
  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: maxAge,
  });
}
module.exports =setCookie