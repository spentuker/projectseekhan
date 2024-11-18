import mongoose from "mongoose";

const input = mongoose.Schema(
  {
    promptInput: {
      type: String,
      required: [true, "Please enter the prompt"],
    },
  },
  {
    timestamps: true,
  }
);
export const prompt = mongoose.model("Prompt", input, "prompts");
