'use strict';

let init = require('./steps/init'); 

let {an_autenticated_user} = require('./steps/given');
let idToken;  

describe(`Given an authenticated user`,() => {
    beforeAll(async() => {
        init();
        let user = await an_autenticated_user(); 
        idToken = user.AuthenticatedResult.IdToken; 
        console.log(idToken)
    }) 

    describe(`When we invoke POST/notes endpoint`,() => {
        it('Should create a new note', async() => {
            expect(true).toBeTrue
        })
    })

})