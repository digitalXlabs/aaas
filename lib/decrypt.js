'use strict'

module.exports = {
    decrypt: function(file) {
      const fs = require('fs');

        try {
            if (!file) {
                throw {
                  name: "error",
                  message: "you must pass a filepath"
                }
            }


            fs.access(file, function(err) {
                if (err) {
                    throw err;
                }
            });
        } catch (err) {
            throw "no access to file";
        }

        const AWS = require('aws-sdk');

        let kms = new AWS.KMS({
            region: "eu-west-1"
        });

        let params = {
            CiphertextBlob: fs.readFileSync(file)
        };

        return kms.decrypt(params).promise();

    }
}
