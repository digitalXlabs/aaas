'use strict'

let rewire = require('rewire');
let dc = rewire('../lib/decrypt');
let kms = {
  decrypt: function(){
    return {
      data: "this is the decrpted file",
      promise: function(){
          return {
            then: function(){

            },
            catch: function(){

            }
          }
      }
    }
  }
}
//
// dc.__set__({
//   kms: kms
// })
describe('Decrypt using kms', function() {

    it('should exist', function() {
        //  let aws =  kms.__get__(AWS);
        expect(dc).toBeDefined();

        expect(function() {
            dc.decrypt()
        }).toThrow('no access to file');

    });

    it('accepts file', function() {
        let path = process.cwd() + '/test/texst.json';
        expect(dc).toBeDefined();
        expect(function() {
            dc.decrypt(path);
        }).toThrow();
    });

    it('decrypts file', function() {
        let path = process.cwd() + '/test/data.json';
        expect(dc).toBeDefined();
        let data = dc.decrypt(path);
        expect(data).toBeDefined();
    });
});
