import Tag from "../../models/Tag";
import { Op } from "sequelize";

interface Request {
    searchParam?: string;
    userId?: string | number;
    companyId?: number;
}

const ListTagsService = async ({
    searchParam,
    userId,
    companyId
}: Request): Promise<Tag[]> => {
    let whereCondition: any = {};

    if (companyId && companyId !== 1) {
        whereCondition.companyId = companyId;
    }

    if (userId) {
        whereCondition.userId = userId;
    }

    if (searchParam) {
        whereCondition.name = {
            [Op.like]: `%${searchParam}%`
        };
    }

    const tags = await Tag.findAll({
        where: whereCondition,
        order: [["name", "ASC"]]
    });

    return tags;
};

export default ListTagsService;
