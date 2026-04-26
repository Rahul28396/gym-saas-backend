const path = require("path");
const fs = require("fs/promises");

const PLANS_FILE_LOCATION = path.join("src", "config", "data", "plans.json");

async function getPlans() {
  const plans = await fs.readFile(PLANS_FILE_LOCATION, {
    encoding: "utf-8",
  });

  return JSON.parse(plans ? plans : JSON.stringify([]));
}

async function getPlan(id) {
  try {
    const plans = await getPlans();
    const plan = plans.find((plan) => plan._id === id);

    return plan;
  } catch (err) {
    throw new Error("Oops!! Fetch failed");
  }
}

async function removePlan(id) {
  try {
    const plans = await getPlans();

    const selectedPlan = plans.find((plan) => plan._id === id);
    const updatedPlans = plans.filter((plan) => plan._id !== id);

    await updatePlans(updatedPlans);

    return selectedPlan;
  } catch (err) {
    throw new Error("Oops!! delete failed");
  }
}

async function updatePlans(plans = []) {
  await fs.writeFile(PLANS_FILE_LOCATION, JSON.stringify(plans));
}

module.exports = {
  getPlans,
  updatePlans,
  getPlan,
  removePlan,
};
