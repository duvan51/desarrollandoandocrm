import Ticket from "../../models/Ticket";
import Tag from "../../models/Tag";
import AppError from "../../errors/AppError";

interface Request {
    ticketId: number | string;
    tags: Tag[];
    userId: number | string;
}

const SyncTicketTagsService = async ({
    ticketId,
    tags,
    userId
}: Request): Promise<Ticket> => {
    const ticket = await Ticket.findByPk(ticketId, {
        include: [{ model: Tag, as: "tags" }]
    });

    if (!ticket) {
        throw new AppError("ERR_NO_TICKET_FOUND", 404);
    }

    // Filter out tags that don't belong to the current user from the current ticket tags
    const otherUsersTags = ticket.tags.filter(tag => tag.userId !== Number(userId));

    // New tags already belong to the user (presumably, since they selected them from their list)
    // But we can double check or just trust the input if we trust the controller.
    // To be safe, let's just combine the lists.
    const newTagsList = [...otherUsersTags, ...tags];

    await ticket.$set("tags", newTagsList.map(t => t.id));

    return ticket;
};

export default SyncTicketTagsService;
