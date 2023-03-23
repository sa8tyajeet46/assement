const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
});

module.exports = mongoose.model("Banner", bannerSchema);
