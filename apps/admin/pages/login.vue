<template>
  <div class="md-layout text-center">
    <div class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100">
      <login-card header-color="rose">
        <h4 slot="title" class="title">Se connecter</h4>
        <md-field :class="[errorClass('email'), 'md-form-group']" slot="inputs">
          <md-icon>email</md-icon>
          <label>Email...</label>
          <md-input v-validate="'required|email'" name="email" v-model="email" type="email"></md-input>
          <div class="pull-right">
            <span :v-if="fields && fields.email && fields.email.invalid" class="md-error right">{{ errors.first('email') }}</span>
            <span :v-if="getEmailError()" class="md-error right">{{ getEmailError() }}</span>
          </div>
        </md-field>
        <md-field :class="[errorClass('password'), 'md-form-group']" slot="inputs">
          <md-icon>lock_outline</md-icon>
          <label>Password...</label>
          <md-input v-validate="'required'" name="password" v-model="password" type="password"></md-input>
          <div class="pull-right">
            <span :v-if="fields && fields.password && fields.password.invalid" class="md-error right">{{ errors.first('password') }}</span>
            <span :v-if="getPasswordError()" class="md-error right">{{ getPasswordError() }}</span>
          </div>
        </md-field>
        <md-button :disabled="disabledButton()" @click="login" slot="footer" :class="[{'md-simple': disabledButton()}, 'md-success md-lg']">
          Se connecter
        </md-button>
      </login-card>
    </div>
  </div>
</template>
<script>
import { LoginCard } from '@/components'
import { createNamespacedHelpers } from 'vuex'

import Swal from 'sweetalert2'

const { mapState, mapActions } = createNamespacedHelpers('auth')

export default {
  components: {
    LoginCard
  },
  data() {
    return {
      firstname: null,
      email: null,
      password: null
    }
  },
  computed: {
    ...mapState(['error', 'authenticated'])
  },
  methods: {
    ...mapActions(['LOGIN']),
    getEmailError() {
      if (this.error && this.error.errors) {
        const { errors } = this.error
        console.log(errors)
        if (errors && errors.length && errors[0].email) {
          return errors[0].email
        }
      }

      return ''
    },
    getPasswordError() {
      if (this.error && this.error.errors) {
        const { errors } = this.error

        if (errors && errors.length && errors[0].password) {
          return errors[0].password
        }
      }
      return ''
    },
    errorClass(field) {
      if (this.fields && this.fields[field] && this.fields[field].invalid) {
        return 'md-invalid mb-4'
      }
      return ''
    },
    disabledButton() {
      const invalid = this.errors.has('email') || this.errors.has('password')
      return !(this.email && this.password) || invalid
    },
    login() {
      this.LOGIN({ email: this.email, password: this.password })
    }
  },
  watch: {
    error: function(err) {
      console.log(err)
      if (err && err.message) {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err.message
        })
      }
    },
    authenticated: function(authenticated) {
      if (authenticated) {
        this.$router.push('/')
      }
    },
    immediate: true
  },
  layout: 'login'
}
</script>

<style></style>
