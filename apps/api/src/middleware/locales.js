import languageParser from 'accept-language-parser';
import { asValue } from 'awilix';

export default async function (ctx, next) {
  const acceptedLanguages = ctx.state.container.cradle.acceptedLanguages;
  const cookies = ctx.cookie || {};
  const lang =
    ctx.query.lang || ctx.get('Accept-Language') || cookies.lang || 'fr';
  const selectedLang = languageParser.pick(acceptedLanguages, lang, {
    loose: true,
  });

  ctx.cookies.set('lang', selectedLang);

  ctx.state.container.register({
    lang: asValue(selectedLang),
  });

  await next();
}
