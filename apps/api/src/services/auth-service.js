export default class AuthService {
  constructor({ logger, userStore }) {
    this.logger = logger;
    this.userStore = userStore;
  }

  loadUserByEmail(email) {
    return this.userStore.findOne({ email });
  }
}
