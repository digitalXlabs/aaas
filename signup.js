'use strict';

const AWS = require("aws-sdk");
const fs = require('fs');
let kms = new AWS.KMS({
    region: "eu-west-1"
});
const params = {
    CiphertextBlob: fs.readFileSync('./encrypted-secret')
};
var config = {};
kms.decrypt(params, function(err, data) {
    if (err) {
        context.fail(err);
    } else {
        config = data;
    }
});

let AWSCognito = new AWS.CognitoIdentityServiceProvider();


class Registrant {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

class SignUp {

    /**
     * constructor - description
     *
     * @return {type}  description
     */
    constructor(event, context, callback) {

        this.event = event;
        this.context = context;
        this.callback = callback;

        this.user = new Registrant(event.email, event.password);
    }

    getPoolData() {
        return {
            UserPoolId: config.user_pool_id,
            ClientId: config.client_id
        }
    }

    getUserPool() {
        return new AWSCognito.CognitoUserPool(this.getPoolData());
    }

    getParams() {
        let attributeList = [];
        let dataEmail = {
            Name: 'email',
            Value: this.user.email
        };
        let dataNickname = {
            Name: 'name',
            Value: this.user.name
        };

        attributeList.push(dataEmail);
        attributeList.push(dataNickname);

         this.params = {
            ClientId: config.client_id,
            Password: this.user.password,
            Username: this.user.email,
            UserAttributes: attributeList,
        }
      }

      sendSignUpRequest(){
        AWSCognito.signUp(this.params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data); // successful response
        });
    }
}

module.exports = {
    SignUp,
    Registrant
}
module.exports.register = function(event, context, cb) {
    // get my user pool from config
    // check I have email and password from event payload
    // define attributes array
    // call sing up
    // if err pass back as a fail
    // otherwise tell user to check email for
}
