import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PropertySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  images: {
    type: Array,
    default: [],
  },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("property", PropertySchema);
