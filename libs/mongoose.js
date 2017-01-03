/**
 * This file must be required at least ONCE.
 * After it's done, one can use require('mongoose')
 *
 * In web-app: this is done at init phase
 * In tests: in mocha.opts
 * In gulpfile: in beginning
 */

const mongoose = require('mongoose');
const config = require('config');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.Promise = Promise;

mongoose.connect(config.mongoose.uri, config.mongoose.options);
mongoose.plugin(beautifyUnique);
module.exports = mongoose;
