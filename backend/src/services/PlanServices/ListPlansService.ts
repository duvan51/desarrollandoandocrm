import Plan from "../../models/Plan";

const ListPlansService = async (): Promise<Plan[]> => {
    const plans = await Plan.findAll({
        order: [["name", "ASC"]]
    });

    return plans;
};

export default ListPlansService;
