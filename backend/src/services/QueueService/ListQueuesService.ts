import Queue from "../../models/Queue";

const ListQueuesService = async ({ companyId }: { companyId: number }): Promise<Queue[]> => {
  let whereCondition = {};

  if (companyId && companyId !== 1) {
    whereCondition = { companyId };
  }

  const queues = await Queue.findAll({
    where: whereCondition,
    order: [["name", "ASC"]]
  });

  return queues;
};

export default ListQueuesService;
