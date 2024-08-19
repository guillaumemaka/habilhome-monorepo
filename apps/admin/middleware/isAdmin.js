export default function ({ store, redirect }) {
  if (
    store.state.auth.userInfo &&
    !store.state.auth.userInfo.roles.includes('admin')
  ) {
    return redirect('/')
  }
}
