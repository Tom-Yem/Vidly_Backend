const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const { User} = require('../../../models/user');

describe('generateToken' ,() =>{
    it('should return a token containing _id & isAdmin properties', () =>{
        const payload = { _id:new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true 
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decodedPayload = jwt.verify(token,config.get('privateKey'));
        expect(decodedPayload).toMatchObject(payload)
    })
})