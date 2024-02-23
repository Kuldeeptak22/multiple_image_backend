import fs from "fs";
import multer from "multer";
import PropertyModel from "../models/property.model";
import { storage } from "../common/multerFile";

// import multer configuration here
const upload = multer({ storage: storage });

// ADD API
export const addProperty = (req, res) => {
  try {
    // multiple images pass through array method
    const uploadMiddleware = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]);

    uploadMiddleware(req, res, async function (err) {
      // Error handling
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }

      // we run a loop to push each image in an array
      let thumbnailImage = null;
      let imageArray = [];
      if (req.files["thumbnail"]) {
        thumbnailImage = req.files["thumbnail"][0].filename;
      }

      if (req.files["images"] && req.files["images"].length > 0) {
        req.files["images"].forEach((image) => {
          imageArray.push(image.filename);
        });
      }

      const saveProperty = await PropertyModel.create({
        ...req.body,
        thumbnail: thumbnailImage,
        images: imageArray,
      });

      // Error Handling
      if (saveProperty) {
        return res.status(201).json({
          data: saveProperty,
          message: "Item has been added Successfully...!!",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await PropertyModel.find({
      status: 1,
    });
    if (properties) {
      return res.status(201).json({
        data: properties,
        message: "Items has been fetched Successfully...!!",
        filepath: `${process.env.BASE_URL}/uploads`,
        total: properties.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/// SINGLE DATA API
export const getProperty = async (req, res) => {
  try {
    const propertyID = req.params.property_id;
    const singlePropertyData = await PropertyModel.findOne({
      status: 1,
      _id: propertyID,
    });
    if (singlePropertyData) {
      return res.status(200).json({
        data: singlePropertyData,
        message: "Data has been Successfully Matched",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE API
export const updateProperty = async (req, res) => {
  try {
    const uploadPropertyData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]);

    uploadPropertyData(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }

      const propertyID = req.params.property_id;
      const { name, address } = req.body;

      const existProperty = await PropertyModel.findOne({ _id: propertyID });

      let thumb = existProperty?.thumbnail;
      let thumbnailImage = thumb;
      let imageArray = existProperty.images || [];

      // ==============================================
      // If Thumbnail will change
        if (req.files["thumbnail"]) {
          thumbnailImage = req.files["thumbnail"][0].filename;
          if (fs.existsSync("./uploads/properties/" + existProperty.thumbnail)) {
            fs.unlinkSync("./uploads/properties/" + existProperty.thumbnail);
          }
        }
      // ===========================================
      //   if Image array will change
        if (req.files["images"]) {
          imageArray.forEach((item) => {
            if (fs.existsSync("./uploads/properties/" + item)) {
              fs.unlinkSync("./uploads/properties/" + item);
            }
          });
          imageArray = [];
          req.files["images"].forEach((image) => {
            imageArray.push(image.filename);
          });
        }

        const updateProperty = await PropertyModel.updateOne(
          { _id: propertyID },
          {
            $set: {
              name: name,
              address: address,
              thumbnail: thumbnailImage,
              images: imageArray,
            },
          }
        );

        if (updateProperty.matchedCount) {
          return res.status(201).json({
            message: "Items has been updated Successfully...!!",
            filepath: `${process.env.BASE_URL}/uploads`,
          });
        }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE API
export const deleteProperty = async (req, res) => {
  try {
    const propertyID = req.params.property_id;
    const deletedProperty = await PropertyModel.updateOne(
      { _id: propertyID },
      {
        $set: {
          status: 0,
        },
      }
    );
    if (deletedProperty.acknowledged) {
      return res.status(200).json({
        message: "Item has been Successfully Deleted..!",
      });
    }
  } catch (error) {
    return res.status(500).jason({
      message: error.message,
    });
  }
};
