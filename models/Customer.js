import { MoneyOffCsredRounded } from "@mui/icons-material";
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  birth_date: {
    type: Date,
    required: true
  },
  mem_number: {
    type: Number,
    required: true
  },
  interest: {
    type: String,
    required: true
  }
});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;
