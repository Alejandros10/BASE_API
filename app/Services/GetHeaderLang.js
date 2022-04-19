'use strict'

const Antl = use('Antl')

class GetHeaderLang {
  setLang(request) {
    let lang = request.header('Accept-Language')
    if (lang !== 'es' && lang !== 'en') {
      lang = Antl.currentLocale()
    }
    return lang
  }

  setLanguage(request, text) {
    let lang = this.setLang(request)
    if (lang !== 'es' && lang !== 'en') {
      lang = Antl.currentLocale()
    }
    return Antl.forLocale(lang).formatMessage(text)
  }

  setLanguageProps(request, text, props) {
    const lang = this.setLang(request)
    return Antl.forLocale(lang).formatMessage(text, {
      ...props,
    })
  }

  convertLanguages(request, textObject) {
    const lang = this.setLang(request)
    return textObject.map((value) => {
      const key = Object.keys(value)[0]
      value[key] = Antl.forLocale(lang).formatMessage(value[key])
      return value
    })
  }

  defaultLang(text) {
    return Antl.forLocale('es').formatMessage(text)
  }
}

module.exports = new GetHeaderLang()
