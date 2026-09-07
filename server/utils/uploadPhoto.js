const cloudinary = require("../config/cloudinary");

const uploadPhoto = async (
    file,
    folder,
    transformations = []
) => {
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
        transformation: transformations
    });

    return result.secure_url;
};

module.exports = uploadPhoto;