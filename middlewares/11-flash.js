module.exports = async function (ctx, next) {

  // keep previous flash
  let messages = ctx.session.messages || {};

  // clear all flash
  delete ctx.session.messages;

  // this.flash('error', 'text') -> SET { error: ['text']}
  // this.flash('error') -> ['text']
  // this.flash() -> { error: ['text'] }
  ctx.flash = function (type, html) {

    if (type === undefined) {
      return messages || {};
    }
    if (html === undefined) {
      return messages[type] || [];
    }

    if (!ctx.session.messages) {
      ctx.session.messages = {};
    }

    if (!ctx.session.messages[type]) {
      ctx.session.messages[type] = [];
    }

    ctx.session.messages[type].push(html);
  };

  await next();

  // note that this.session can be null after other middlewares,
  // e.g. logout does session.destroy()
  if (!ctx.session) {
    return;
  }

  if (ctx.status == 302 && !ctx.session.messages) {
    // pass on the flash over a redirect
    ctx.session.messages = messages;
  }

};
