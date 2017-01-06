const crypto = require('crypto');
const hash = crypto.createHash('sha1');
module.exports = async function (ctx) {
  const {sha1_hash, notification_type, operation_id, amount, currency, datetime, sender, codepro, label }=ctx.request.body
  const secret = '78Q2ko2OHNFqMrlSu7OI4Tct';
  hash.update(`${notification_type}&${operation_id}&${amount}&${currency}&${datetime}&${sender}&${codepro}&${secret}&${label}`);
  console.log(hash.digest('hex') == sha1_hash);
};
