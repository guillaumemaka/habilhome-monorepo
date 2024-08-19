export default function(context) {
  const { store, redirect } = context

  // If the user is not authenticated
  if (!store.state.auth.authenticated) {
    store.dispatch('auth/LOGOUT')

    let redirectTo = null

    if (process.server) {
      redirectTo = context.req.url
    }

    if (process.client) {
      redirectTo = context.from.path
    }

    redirectTo = redirectTo || '/'

    return redirect('/login?redirect=' + redirectTo)
  }
}
