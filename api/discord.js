const express = require('express');
const DiscordOauth2 = require("discord-oauth2");
const router = express.Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const PORT = process.env.PORT || 5000;
const redirect = encodeURIComponent(`${REDIRECT_URL}/api/discord/callback`);

console.log(redirect);

const discordAuth = new DiscordOauth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: `${REDIRECT_URL}/api/discord/callback`
});

router.get('/login', (req, res) => {
  const url = discordAuth.generateAuthUrl({
    scope: ['identify']
  })

  res.redirect(url);
});

router.get('/callback', async (req, res) => {

  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;

  let tokenResp = await discordAuth.tokenRequest({
    code: code,
    scope: 'identify',
    grantType: 'authorization_code'
  })
    .catch(err => console.log(err.message));

  console.log(tokenResp);

  req.session.token = tokenResp.access_token;

  console.log(req.session);

  res.redirect(`/?login=success`);

});

module.exports = router;