export default {
  getThemesForAutoCompletion (state) {
    if (!state.data) {
      return []
    }

    if (!state.data.results) {
      return []
    }

    const { results } = state.data

    const themes = results.reduce((prev, theme) => {
      prev.fr = prev.fr || []
      prev.fr = [...prev.fr, ...theme.subThemes.map(t => ({ parent: theme.name, name: t }))]

      prev.en = prev.en || []
      prev.en = [...prev.en, ...theme.translation[0].subThemes.map(t => ({ parent: theme.name, name: t }))]

      return prev
    }, {})

    return themes
  }
}
