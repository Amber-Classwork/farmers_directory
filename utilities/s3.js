const AWS = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");
// multer-s3 and aws-sdk should have same major release version. ie 2.x.x or 3.x.x
const multerS3 = require("multer-s3");





// create a new instance of s3 bucket

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;

const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey
})


/**
 *  Description
 * Multer option to chose storage path of file from requests to be sent to the aws instance that was defined. 
 */
const uploadFileToS3 = multer({
    storage: multerS3({
        s3,
        bucket:bucketName,
        metadata: (req, file, cb)=>{
            cb(null, {fieldName: file.fieldname})
        },
        key:(req, file, cb)=>{
            cb(null, Date.now().toString() + '-' + file.originalname);
        }

    })
})

const deleteObjectFromS3 = async (location)=>{
        if(!location) return Promise.reject(new Error("No location was specified"))
        let objectName = location.split('/').slice(-1)[0];
        
        const params = {
            Bucket : bucketName,
            Key: objectName,
        }
        try{
            // checks to see if there is any errors with the file metadata.
            await s3.headObject(params).promise();

            await s3.deleteObject(params).promise();

        }catch(error){
            return Promise.reject(new Error("File not found Error : " + error.code));
        }
}




// function deleteFileFromS3 = 


module.exports = {
    uploadFileToS3,
    deleteObjectFromS3
}


// downloads a file from s3