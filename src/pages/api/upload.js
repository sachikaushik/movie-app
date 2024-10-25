import AWS from "aws-sdk";
import formidable from "formidable";
import fs from "fs";

// Initialize the AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Disable Next.js body parsing for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Create a function to handle the incoming request
export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({ multiples: false }); // Adjust if you need multiple files

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing the file:", err);
        return res.status(500).json({ error: "Error parsing the file" });
      }
      //   console.log(fields, files);

      const uploadedFiles = Array.isArray(files.file)
        ? files.file
        : [files.file]; // Ensure file is an array

      // Check if any file is provided
      if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        // Process each file
        const uploadPromises = uploadedFiles.map(async (file) => {
          // Read the file content from the temporary path
          const fileContent = fs.readFileSync(file.filepath);

          // Set up S3 upload parameters
          const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file.originalFilename, // Use a unique key for your file
            Body: fileContent, // Use the file content buffer
            ContentType: file.mimetype,
          };

          // Upload to S3
          return s3.upload(s3Params).promise();
        });

        // Wait for all uploads to complete
        const uploadResults = await Promise.all(uploadPromises);
        res.status(200).json({
          message: "Files uploaded successfully",
          data: uploadResults,
        });
      } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ error: "Error uploading files to S3" });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
