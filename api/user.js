const express = require('express');
const DiscordOauth2 = require("discord-oauth2");
const router = express.Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

const discordAuth = new DiscordOauth2();

router.get('/', async (req, res) => {
  console.log(req.session);

  if(req.session.token){
      let user = await discordAuth.getUser(req.session.token);

      res.send({...user});
  }

  else {
    req.session.destroy();
    res.send({});
  }

  
});

module.exports = router;