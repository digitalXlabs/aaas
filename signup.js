'use strict';


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
        this.AWS = require("aws-sdk");
        this.setConfigRegion("eu-west-1");

        this.AWSCognito = new this.AWS.CognitoIdentityServiceProvider();

        this.event = event;
        this.context = context;
        this.callback = callback;

        this.user = new Registrant(event.email, event.password);
        this.getParams.bind(this);
    }

    setConfigRegion(region) {
        this.AWS.config.update({
            region: region
        });
    }

    getPoolData() {
        return {
            UserPoolId: config.user_pool_id,
            ClientId: config.client_id
        }
    }

    getUserPool() {
        console.log("function getuserpool" + config.client_id);
        return new this.AWSCognito.CognitoUserPool(this.getPoolData());
    }

    getParams() {
        // console.log("function getparams");
        // console.log(this.config);
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

        return {
            ClientId: this.config.client_id,
            Password: this.user.password,
            Username: this.user.email,
            UserAttributes: attributeList,
            ValidationData: [{
                Name: 'namevalidatoin',
                Value: 'notsurewhatshouldbehere'
            }]
        }
    }
    sendSignUpRequest() {
        // this.getParams();
        let that = this;
        this.AWSCognito.signUp(this.getParams(), function(err, data) {
            if (err) that.context.fail(err); // an error occurred
            else that.context.succeed({
                result: data
            }); // successful response
        });
    }

    doOne() {
        // should have encrypted-secret data
        let that = this;
        let kms = require('./lib/decrypt');
        let decrypted = kms.decrypt('./encrypted-secret');
        decrypted
            .then(function(data) {
                that.config = JSON.parse(data['Plaintext'].toString());
                that.AWSCognito.signUp(that.getParams(), function(err, data) {
                    if (err) that.context.fail(err); // an error occurred
                    else that.context.succeed({
                        result: data
                    }); // successful response
                });
            })
            .catch(function(err) {
                this.context.fail(err);
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
    const stuffandfings = new SignUp(event, context, cb);
    stuffandfings.doOne();
}
