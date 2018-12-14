const mongoCollections = require("../config/mongoCollections");
const trainer = mongoCollections.trainer;
const uuid = require('uuid/v1');


const exportedMethods = {
    async addTrainer(trainername, certifications, biography) {

        if (!trainername) throw "No trainername provided";
        if (!certifications) throw "No certifications provided";
        if (!biography) throw "No biography provided";

        const trainerCollection = await trainer();
        const newtrainer = {
            _id: uuid(),
            trainername: trainername,
            certifications: certifications,
            biography: biography
        };

        const addedtrainer = await trainerCollection.insertOne(newtrainer);
        const newId = addedtrainer.insertedId;

        return {
            status: true,
            addedtrainer,
            newId
        }

    },


    async removeTrainer(trainerId) {
        if (!trainerId) throw "You must provide an id to delete";

        const trainerCollection = await trainer();

        const removeTrainer = await trainerCollection.removeOne({ _id: trainerId });

        if (removeTrainer.deletedCount === 0) {
            throw `Could not delete activity with id: ${trainerId}`;
        }
    },


    async getAllTrainers() {
        const trainerCollection = await trainer();
        const getTrainers = await trainerCollection.find({}).toArray();
        return getTrainers;

    },

    async getTrainerById(trainerid) {
        const trainerCollection = await trainer();
        const getTrainer = await trainerCollection.findOne({ _id: trainerid });
        return getTrainer;
    },

    async updateTrainer(trainerId, updatedTrainer) {
        const trainerCollection = await trainer();
        const updatedDataTrainer = {};
        if (!trainerId) throw "invalid id";
        if (updatedTrainer.trainername) {
            updatedDataTrainer.trainername = updatedTrainer.trainername;
        }
        if (updatedTrainer.certifications) {
            updatedDataTrainer.certifications = updatedTrainer.certifications;
        }
        if (updatedTrainer.biography) {
            updatedDataTrainer.biography = updatedTrainer.biography;
        }


        let updateCommand = {
            $set: updatedDataTrainer
        };

        const query = {
            _id: trainerId
        };

        await trainerCollection.updateOne(query, updateCommand);
        return await this.getTrainerById(trainerId);
    },


}
module.exports = exportedMethods;