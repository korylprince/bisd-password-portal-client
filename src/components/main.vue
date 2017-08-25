<template>
    <md-card class="bisd-main">
        <md-card-area md-inset v-if="!username">
            <md-card-header >
                <div class="md-headline">Password Portal</div>
                <div class="md-subheading">Enter your information</div>
            </md-card-header>
        </md-card-area>

        <md-card-content v-if="!username">
            <form novalidate @keyup.enter.prevent.stop="submit(student)">

                <md-input-container :class="{'md-input-invalid': errors.has('Last Name')}">
                    <label>Last Name</label>
                    <md-input ref="last_name" v-model="student.last_name" v-validate="'required'" data-vv-name="Last Name" data-vv-rules="'required'" required></md-input>
                    <span class="md-error">{{errors.first("Last Name")}}</span>
                </md-input-container>

                <md-input-container :class="{'md-input-invalid': errors.has('Birth Date')}">
                    <label>Birth Date</label>
                    <md-input ref="birth_date" v-model="student.birth_date" v-validate="'required|date_format:MM/DD/YYYY'" data-vv-name="Birth Date" required></md-input>
                    <span class="md-error">{{errors.first("Birth Date")}}</span>
                </md-input-container>

                <md-input-container :class="{'md-input-invalid': errors.has('SSN')}" md-has-password>
                    <label>SSN (Last 4)</label>
                    <md-input ref="ssn" v-model="student.ssn" v-validate="'required|numeric|digits:4'" data-vv-name="SSN" type="password" required></md-input>
                    <span class="md-error">{{errors.first("SSN")}}</span>
                </md-input-container>

            </form>
        </md-card-content>

        <md-card-area md-inset v-if="username">
            <md-card-header >
                <div class="md-headline">Username &amp; Password</div>
                <div class="md-subheading">Use this information to sign in</div>
            </md-card-header>
        </md-card-area>

        <md-card-content v-if="username">
            <md-input-container>
                <label>Username</label>
                <md-input v-model="username" readonly></md-input>
            </md-input-container>
            <span class="input-note">The last character is a number</span>

            <md-input-container>
                <label>Password</label>
                <md-input v-model="password" readonly></md-input>
            </md-input-container>
        </md-card-content>

        <md-card-actions>
            <md-button class="md-accent" @click="exit()">Exit</md-button>
            <md-button class="md-primary" @click="submit(student)" :disabled="valid" v-if="!username">Submit</md-button>
        </md-card-actions>

        <md-dialog ref="dialog">
            <md-dialog-title>Error</md-dialog-title>

            <md-dialog-content>
                {{error}}
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="$refs.dialog.close()">Close</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-card>
</template>

<script>
import moment from "moment";
import Cleave from "cleave.js";
import api from "../js/api.js";

export default {
    name: "main",
    data: function() {
        return {
            student: {
                last_name: null,
                birth_date: null,
                ssn: null
            },
            error: null,
            username: null,
            password: null
        };
    },
    computed: {
        valid: function() {
            return this.errors.any() || this.student.last_name == null || this.student.birth_date == null || this.student.ssn == null;
        }
    },
    methods: {
        exit: function() {
            window.close();
        },
        submit: function(student) {
            this.error = null;
            this.username = null;
            this.password = null;

            this.$validator.validateAll();
            if (this.errors.any()) {
                return;
            }

            var d = moment(student.birth_date, "MM/DD/YYYY");
            var s = {
                "last-name": student.last_name,
                "birth-date": d.format("YYYY-MM-DD"),
                "ssn": student.ssn
            };

            var promise = api.requestCredentials(s);

            promise.then((resp) => {
                this.username = resp.data.username;
                this.password = resp.data.password;
            }).catch((error) => {
                if (error.response != null) {
                    if (error.response.status === 400) {
                        this.error = "The information given is incorrect.";
                    } else if (error.response.status === 429) {
                        this.error = "Too many requests. Try again later.";
                    } else {
                        this.error = "An unknown error occured: " + error.response.statusText + ". Try again later.";
                    }
                } else {
                    this.error = "An unknown error occured: " + error.message + ". Try again later.";
                }
                this.$refs.dialog.open();
                console.error({error: error});
            });
        }
    },
    created: function() {
        this.$nextTick(function() {
            new Cleave(this.$refs.birth_date.$el, {date: true, datePattern: ["m", "d", "Y"]});
            new Cleave(this.$refs.ssn.$el, {numbericOnly: true, blocks: [4]});
        });
    }
};
</script>
<style lang="stylus">
.input-note 
    display: block
    margin-top: -20px
    margin-bottom: 20px
    font-size: 0.9em
    color: #555
</style>
