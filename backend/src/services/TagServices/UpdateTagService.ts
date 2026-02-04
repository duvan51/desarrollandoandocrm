import Tag from "../../models/Tag";
import AppError from "../../errors/AppError";

interface TagData {
    name?: string;
    color?: string;
}

interface Request {
    tagData: TagData;
    tagId: string | number;
    userId: string | number;
}

const UpdateTagService = async ({
    tagData,
    tagId,
    userId
}: Request): Promise<Tag> => {
    const { name, color } = tagData;

    const tag = await Tag.findOne({
        where: { id: tagId, userId }
    });

    if (!tag) {
        throw new AppError("ERR_NO_TAG_FOUND", 404);
    }

    await tag.update({
        name,
        color
    });

    return tag;
};

export default UpdateTagService;
