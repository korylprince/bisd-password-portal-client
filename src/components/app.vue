<template>
    <v-app id="app">
        <v-content>
            <v-container id="container" fluid :pa-0="$vuetify.breakpoint.xsOnly">
                <v-row justify="center" align="center">
                    <v-card width="100%" max-width="600px">
                        <v-card-title primary-title>
                            <div class="headline">BISD Password Portal</div>
                        </v-card-title>

                        <validation-observer ref="form" v-slot="{invalid}">
                            <form novalidate @submit.prevent="get_passwd(first_name, last_name, birth_date_date, ssn)">
                                <v-card-text>
                                    <validation-provider name="first_name" rules="required" v-slot="{errors}">
                                        <v-text-field
                                            label="First Name"
                                            v-model="first_name"
                                            :error-messages="errors"
                                            required>
                                        </v-text-field>
                                    </validation-provider>

                                    <validation-provider name="last_name" rules="required" v-slot="{errors}">
                                        <v-text-field
                                            label="Last Name"
                                            v-model="last_name"
                                            :error-messages="errors"
                                            required>
                                        </v-text-field>
                                    </validation-provider>

                                    <validation-provider name="birth_date" rules="required" v-slot="{errors}">
                                        <v-text-field
                                            label="Birth Date"
                                            v-model="birth_date"
                                            type="date"
                                            :error-messages="errors"
                                            required>
                                        </v-text-field>
                                    </validation-provider>

                                    <validation-provider name="ssn" :rules="{ regex: /^[0-9]{4}$/ }" v-slot="{errors}" mode="eager">
                                        <v-text-field
                                            label="Last Four Numbers of SSN"
                                            v-model="ssn"
                                            v-mask="'####'"
                                            type="tel"
                                            :error-messages="errors"
                                            required>
                                        </v-text-field>
                                    </validation-provider>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit"
                                           color="primary"
                                           text
                                           :loading="loading"
                                           :disabled="invalid || first_name === '' || last_name === '' || birth_date === '' || ssn === ''">
                                        Submit</v-btn>
                                </v-card-actions>
                            </form>
                        </validation-observer>
                    </v-card>

                </v-row>
            </v-container>
        </v-content>

        <v-dialog v-model="dialog" max-width="320">
            <v-card>
                <v-card-title class="headline">{{dialog_title}}</v-card-title>
                <v-card-text v-if="dialog_user">
                    <strong>Student:</strong> {{dialog_user.first_name}} {{dialog_user.last_name}} <br />
                    <strong>Username:</strong> {{dialog_user.username}} <br />
                    <strong>Email:</strong> {{dialog_user.username}}@bullardisd.net <br />
                    <strong>Password:</strong> {{dialog_user.password}}
                </v-card-text>
                <v-card-text v-else>{{dialog_text}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
import {mask} from "vue-the-mask"
import api from "../js/api.js"
export default {
    name: "my-app",
    directives: {mask},
    data() {
        return {
            first_name: "",
            last_name: "",
            birth_date: "",
            ssn: "",
            loading: false,
            dialog: false,
            dialog_title: "",
            dialog_text: "",
            dialog_user: null,
        }
    },
    computed: {
        birth_date_date() {
            return new Date(this.birth_date)
        },
    },
    methods: {
        async get_passwd(first_name, last_name, birth_date, ssn) {
            if (this.loading || !(await this.$refs.form.validate())) {
                return
            }
            this.loading = true
            this.dialog_user = null
            try {
                const user = (await api.get_passwd(first_name, last_name, birth_date, ssn)).data
                this.dialog_title = "Information Verified"
                this.dialog_user = user
                this.dialog = true
                this.loading = false
            } catch (err) {
                this.loading = false
                console.error(err)
                if (err.response != null && err.response.status == 404) {
                    this.dialog_title = "No Match"
                    this.dialog_text = "The information you provided doesn't match any students. Please try again."
                    this.dialog = true
                } else if (err.response != null && err.response.status == 429) {
                    this.dialog_title = "Too Many Tries"
                    this.dialog_text = "You've tried submitting a request too many times. Please try again in a few minutes."
                    this.dialog = true
                } else {
                    this.dialog_title = "Unknown Error"
                    this.dialog_text = "An unknown error occurred. Please contact the system administrator."
                    this.dialog = true
                }
            }
        },
    },
}
</script>
<style lang="sass">
#app
    background-color: #0d47a1
#container
    display: flex
    min-height: 100vh
</style>
