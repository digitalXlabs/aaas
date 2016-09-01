'use strict'

const rewire = require("rewire");
const AWS = require("aws-sdk");

const cispCallback = function(err, data) {
  expect(err).toBeDefined();
  expect(data).toBeUndefined();

}

const AWSCognito = {
    signUp: function(params, cispCallback) {
        if (!params) cispCallback("There are no parameters");
        else callback(null, "the data is processed");
    }
}

const obj = rewire('../signup');

const event = {
    "email": "test@example.com",
    "password": "this is my Passewor"
}

const context = {
    fail: function(message) {
      expect(message).toBeUndefined();
    },
    success: function(data) {
      expect(data).toBeDefined();
    }
}

const callback = function(err, data) {
  expect(data).toBeDefined();
  expect(err).toBeDefined();  // null
}

const kms = {
    decrypt: function(params, callback) {},
}

var config = {
    "region": "eu-west-1",
    "pool_id": "eu-west-1:cladhasdas",
    "user_pool_id": "eu-west-sdfsldkfj lsdjfsd",
    "client_id": "ds;fk;sdlkf;sldkfsdfhskdfjhksdjhfksdjhfks"
}

obj.__set__({
    kms: kms,
    config: config,
    AWSCognito: AWSCognito

});

describe('Sign up handlers', function() {

    describe('Signup file', function() {
        it('Registrant class should exist', function() {
            let user = new obj.Registrant(event.email, event.password);
            expect(user).toBeDefined();
            expect(user.constructor.name).toMatch('Registrant');
            expect(user.email).toMatch(event.email);
            expect(user.password).toMatch(event.password);
        });

        it('Sign up class constructor', function() {

            let signUp = new obj.SignUp(event, context, callback);

            expect(signUp).toBeDefined();
            expect(signUp.constructor.name).toMatch('SignUp');

            expect(signUp.event).toBeDefined();
            expect(signUp.callback).toBeDefined();
            expect(signUp.context).toBeDefined();

            expect(signUp.user).toBeDefined();
            expect(signUp.user.email).toMatch(event.email);
            expect(signUp.user.password).toMatch(event.password);

            // expect(signUp.AWSCognito).toBeDefined();

        });


    });

    it('Sign up getPoolData', function() {
        let signUp = new obj.SignUp(event, context, callback);
        let data = signUp.getPoolData();

        expect(signUp).toBeDefined();
        expect(signUp.constructor.name).toMatch('SignUp');
        expect(data).toBeDefined();
        expect(data.UserPoolId).toMatch(config.user_pool_id);
        expect(data.ClientId).toMatch(config.client_id);

    });

    it('Sign up getParams', function() {
        let signUp = new obj.SignUp(event, context, callback);
        signUp.getParams();

        expect(signUp).toBeDefined();
        expect(signUp.constructor.name).toMatch('SignUp');
        expect(signUp.params).toBeDefined();
        expect(signUp.params.ClientId).toBeDefined();
        expect(signUp.params.ClientId).toMatch(config.client_id);
        expect(signUp.params.Password).toBeDefined();
        expect(signUp.params.Password).toMatch(signUp.user.password);
        expect(signUp.params.Username).toBeDefined();
        expect(signUp.params.Username).toMatch(signUp.user.email);
        expect(signUp.params.UserAttributes).toBeDefined();
        // expect(signUp.params.UserAttributes).toMatch(config.client_id);

    });

    it('Sign up sendSignUpRequest', function() {
        let signUp = new obj.SignUp(event, context, callback);

        expect(signUp).toBeDefined();
        expect(signUp.constructor.name).toMatch('SignUp');
        expect(signUp.params).toBeUndefined();

        signUp.getParams();
        expect(signUp.params).toBeDefined();

        signUp.sendSignUpRequest();


    });

});
