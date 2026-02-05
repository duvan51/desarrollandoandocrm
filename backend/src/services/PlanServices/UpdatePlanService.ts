import AppError from "../../errors/AppError";
import Plan from "../../models/Plan";

interface PlanData {
    name: string;
    users?: number;
    whatsapps?: number;
    queues?: number;
    value?: number;
}

interface Request {
    planData: PlanData;
    planId: string | number;
}

const UpdatePlanService = async ({
    planData,
    planId
}: Request): Promise<Plan> => {
    const plan = await Plan.findByPk(planId);

    if (!plan) {
        throw new AppError("ERR_NO_PLAN_FOUND", 404);
    }

    const { name, users, whatsapps, queues, value } = planData;

    await plan.update({
        name,
        users,
        whatsapps,
        queues,
        value
    });

    return plan;
};

export default UpdatePlanService;
