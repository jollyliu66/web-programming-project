const mongoCollections = require("../config/mongoCollections");
const gymMember = mongoCollections.gymMember;
const uuid = require('uuid/v1');

const exportedMethods = {

    async addGymMember(membername, memberaddress, memberemail, membermobileno,memberdob,membergender,memberusername,memberheight,memberweight,bmi) {
        if (!membername) throw "No member name provided";
        if (!memberaddress) throw "No member address provided";
        if (!memberemail) throw "No member email provided";
        if (!membermobileno) throw "No member mobileno provided";
        if (!memberdob) throw "No member date of birth provided";
        if (!membergender) throw "No member gender provided";
        if (!memberusername) throw "No member username provided";
        if (!memberheight) throw "No member height provided";
        if (!memberweight) throw "No member weight provided";
       
        
        const gymMemberCollection = await gymMember();
        const newgymmember = {
            _id: uuid(),
            membername: membername,
            memberaddress: memberaddress,
            memberemail: memberemail,
            membermobileno: membermobileno,
            memberdob: memberdob,
            membergender: membergender,
            memberusername: memberusername,
            memberheight: memberheight,
            memberweight: memberweight,
            bmi: bmi

        };
        const addedgymmember = await gymMemberCollection.insertOne(newgymmember);
        const newId = addedgymmember.insertedId;
        if (addedgymmember.insertedCount === 0) {
            throw "Could not add member successfully";
        }
        return {
            status: true,
            addedgymmember,
            newId
        }
    },   
    
    async getAllGymMembers() {
        const gymMemberCollection = await gymMember();
        const getGymMembers = await gymMemberCollection.find({}).toArray();
        return getGymMembers;
    },

    async getGymMemberById(memberId) {
        const gymMemberCollection = await gymMember();
        const getMember = await gymMemberCollection.findOne({ _id: memberId });
        return getMember;
    },
    async removeGymMember(memberId) {
        if (!memberId) throw "You must provide an id to delete";

        const gymMemberCollection = await gymMember();

        const removeMember = await gymMemberCollection.removeOne({ _id: memberId });

        if (removeMember.deletedCount === 0) {
            throw `Could not delete membership with id: ${memberId}`;
        }
    },
    async updateGymMember(memberId,membername, memberaddress, memberemail, membermobileno,memberdob,membergender,memberusername,memberheight,memberweight,bmi) {
        if (!memberId) throw "You must provide an id to update";
        const gymMemberCollection = await gymMember(); 
    
        const updatedMember = await gymMemberCollection.updateOne({ _id: memberId }, 
            {$set: 
            {   membername: membername,
                memberaddress: memberaddress,
                memberemail: memberemail,
                membermobileno: membermobileno,
                memberdob: memberdob,
                membergender: membergender,
                memberusername: memberusername,
                memberheight: memberheight,
                memberweight: memberweight,
                bmi: bmi
            } 
        });
    
        // if (updatedMember.modifiedCount === 0) {
        //   throw "Could not update task successfully";
        // }
        return updatedMember;
    },
}
module.exports = exportedMethods;