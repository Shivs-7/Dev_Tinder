// const mongoose=require("mongoose");

// const chatSchema=new mongoose.Schema({
//    participants:[ObjectId,ObjectId],

//    message:[{
//     senderId,
//     text,
//     createdAt,
//    }]

// })

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: function (value) {
          return value.length === 2;
        },
        message: "Chat must have exactly 2 participants.",
      },
    },

    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        text: {
          type: String,
          required: true,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);