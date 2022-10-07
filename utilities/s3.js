const AWS = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");
const multerS3 = require("multer-s3");





// create a new instance of s3 bucket

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

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

const deleteObject = async (objectName)=>{
    const params = {
        Bucket : bucketName,
        Key: objectName,
    }

    try{
        await s3.deleteObject(params).promise();
        console.log("File deleted Successfully")
    }catch(error){
        console.log("Error in deleting file : " + JSON.stringify(error))
    }
}




// function deleteFileFromS3 = 


module.exports = {
    uploadFileToS3,
    deleteObject
}


// downloads a file from s3