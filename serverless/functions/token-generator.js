let path = Runtime.getFunctions()['dialpad-utils'].path;
let assets = require(path);

exports.handler = async (context, event, callback) => {
  // make sure you enable ACCOUNT_SID and AUTH_TOKEN in Functions/Configuration
  const ACCOUNT_SID = process.env.ACCOUNT_SID;

  console.log(event);

  const SERVICE_SID = process.env.SYNC_SERVICE_SID;
  const API_KEY = process.env.TWILIO_API_KEY;
  const API_SECRET = process.env.TWILIO_API_SECRET;

  /*const IDENTITY = event.TokenResult.identity;

  const AccessToken = Twilio.jwt.AccessToken;
  const SyncGrant = AccessToken.SyncGrant;

  const syncGrant = new SyncGrant({
    serviceSid: SERVICE_SID
  });

  const accessToken = new AccessToken(
    ACCOUNT_SID,
    API_KEY,
    API_SECRET
  );

  accessToken.addGrant(syncGrant);
  accessToken.identity = IDENTITY;*/

  callback(null, assets.response("json", { token: accessToken.toJwt() }));
};
