const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const asyncHandler = require("express-async-handler");

const s3Client = new S3Client({
  region: process.env.REGION_NAME,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const uploadFiles = asyncHandler(async (files) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  if (!Array.isArray(files)) {
    files = [files];
  }

  const uploadPromises = files.map(async (file) => {
    if (!file.originalname) {
      throw new Error("File not found");
    }

    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${Date.now().toString()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);

    try {
      const response = await s3Client.send(command);
      console.log("response: " + response);
      return { Key: uploadParams.Key, ...response };
    } catch (e) {
      console.error("S3 upload error:", e);
      throw e;
    }
  });

  return Promise.all(uploadPromises);
});

const deleteFiles = async (urls) => {
  if (!urls || urls.length === 0) {
    throw new Error("No URLs provided for deletion");
  }

  // Extract keys using map
  const keys = urls.map((url) => url.split("/").pop());

  const deletePromises = keys.map((key) => {
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);

    return s3Client
      .send(command)
      .then(() => {
        console.log(`Successfully deleted ${key} from S3`);
      })
      .catch((error) => {
        console.error(`Error deleting ${key} from S3:`, error);
        throw error;
      });
  });

  return Promise.all(deletePromises);
};

module.exports = { uploadFiles, deleteFiles };
