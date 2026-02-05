import Queue from "../../models/Queue";
import Whatsapp from "../../models/Whatsapp";

const ListWhatsAppsService = async (companyId: number): Promise<Whatsapp[]> => {
  let whereCondition = {};

  if (companyId === 1) {
    whereCondition = {};
  } else if (companyId) {
    whereCondition = {
      companyId
    };
  } else {
    whereCondition = {
      companyId: -1
    };
  }

  const whatsapps = await Whatsapp.findAll({
    where: whereCondition,
    include: [
      {
        model: Queue,
        as: "queues",
        attributes: ["id", "name", "color", "greetingMessage"]
      }
    ]
  });

  return whatsapps;
};

export default ListWhatsAppsService;
