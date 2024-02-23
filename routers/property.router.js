import express from "express";
import {
  addProperty,
  deleteProperty,
  getProperties,
  getProperty,
  updateProperty,
} from "../controllers/property.controller";
const router = express.Router();

router.post("/add_property", addProperty);
router.get("/get_properties", getProperties);
router.get("/get_property/:property_id", getProperty);
router.put("/update_property/:property_id", updateProperty);
router.delete("/delete_property/:property_id", deleteProperty);

export default router;
