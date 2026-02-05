import Company from "../models/Company";
import Plan from "../models/Plan";
import AppError from "../errors/AppError";
import User from "../models/User";
import Whatsapp from "../models/Whatsapp";
import Queue from "../models/Queue";

export const CheckSettings = async (companyId: number, type: "users" | "whatsapps" | "queues"): Promise<void> => {
    const company = await Company.findByPk(companyId, {
        include: [{ model: Plan, as: "planData" }]
    });

    if (!company || !company.planData) {
        throw new AppError("Plan not found", 400);
    }

    const plan = company.planData;
    let currentCount = 0;

    if (type === "users") {
        currentCount = await User.count({ where: { companyId } });
        if (plan.users > 0 && currentCount >= plan.users) {
            throw new AppError("Límite de usuarios alcanzado para su plan.", 403);
        }
    }

    if (type === "whatsapps") {
        currentCount = await Whatsapp.count({ where: { companyId } });
        if (plan.whatsapps > 0 && currentCount >= plan.whatsapps) {
            throw new AppError("Límite de conexiones de WhatsApp alcanzado para su plan.", 403);
        }
    }

    if (type === "queues") {
        currentCount = await Queue.count({ where: { companyId } });
        if (plan.queues > 0 && currentCount >= plan.queues) {
            throw new AppError("Límite de sectores/filas alcanzado para su plan.", 403);
        }
    }
};
