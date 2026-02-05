import AppError from "../../errors/AppError";
import Plan from "../../models/Plan";

const DeletePlanService = async (id: string | number): Promise<void> => {
    const plan = await Plan.findByPk(id);

    if (!plan) {
        throw new AppError("ERR_NO_PLAN_FOUND", 404);
    }

    await plan.destroy();
};

export default DeletePlanService;
