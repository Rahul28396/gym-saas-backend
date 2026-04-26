const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const url = require("url");

//Routers import 
const membersRouter = require('./src/modules/member/member.route');
const plansRouter = require('./src/modules/plan/plan.route');

const app = express();

app.use(express.json());

// Routers
app.use('/members',membersRouter);
app.use('/plans', plansRouter)

module.exports = app;