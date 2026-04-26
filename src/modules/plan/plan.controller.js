const {
  getPlans,
  updatePlans,
  getPlan,
  removePlan,
} = require("./Plan.service");

const getPlansController = async (req, res) => {
  try {
    const plans = await getPlans();
    return res.status(200).send(plans);
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: "bad response" });
  }
};

const getPlanController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const plan = await getPlan(id);

    if (!plan) {
      return res.status(404).send({ error: "Plan not found" });
    }

    return res.status(200).send(plan);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Bad request" });
  }
};

const createPlanController = async (req, res) => {
  try {
    let plans = [];

    plans = await getPlans();

    const newplan = req.body;
    newplan._id = plans.length + 1;

    plans.push(newplan);

    await updatePlans(plans);

    return res.status(200).send(newplan);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "bad response" });
  }
};

const updatePlanController = async (req, res) => {
  try {
    let plans = await getPlans();
    const id = Number(req.params.id); // ensure numeric comparison
    const plan = await getplan(id);

    if (plan) {
      const updatedFields = req.body;
      const updatedplan = { ...plan, ...updatedFields };

      // Replace old plan with updated one
      plans = plans.map((plan) => (plan._id === id ? updatedplan : plan));

      await updatePlans(plans);

      return res.status(200).send(updatedplan);
    } else {
      return res.status(404).send({ error: "Plan not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: "Bad response" });
  }
};

const deletePlanController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const plan = await removeplan(id);

    if (!plan) {
      return res.status(404).send({ error: "Not Plan found" });
    }

    return res.status(200).send(plan);
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};

module.exports = {
    getPlansController,
    createPlanController,
    getPlanController,
    updatePlanController,
    deletePlanController
}