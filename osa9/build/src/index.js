"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diagnoses_1 = __importDefault(require("./routes/diagnoses"));
const app = express_1.default();
const cors = require("cors");
app.use(express_1.default.json());
app.use(cors);
const PORT = 3001;
app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.use("/api/diagnoses", diagnoses_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
