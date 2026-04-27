const express = require("express");
const cors = require("cors");
//Routers import 
const membersRouter = require('./src/modules/member/member.route');
const plansRouter = require('./src/modules/plan/plan.route');

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());


// Routers
app.use('/members',membersRouter);
app.use('/plans', plansRouter)

module.exports = app;