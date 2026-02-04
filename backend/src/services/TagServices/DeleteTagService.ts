import Tag from "../../models/Tag";
import AppError from "../../errors/AppError";

const DeleteTagService = async (
    id: string | number,
    userId: string | number
): Promise<void> => {
    const tag = await Tag.findOne({
        where: { id, userId }
    });

    if (!tag) {
        throw new AppError("ERR_NO_TAG_FOUND", 404);
    }

    await tag.destroy();
};

export default DeleteTagService;
