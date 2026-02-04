import Tag from "../../models/Tag";

interface Request {
    name: string;
    color?: string;
    userId: number;
}

const CreateTagService = async ({ name, color, userId }: Request): Promise<Tag> => {
    const tag = await Tag.create({ name, color, userId });
    return tag;
};

export default CreateTagService;
