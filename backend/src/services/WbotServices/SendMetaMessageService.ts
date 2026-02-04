import axios from "axios";
import AppError from "../../errors/AppError";

interface RequestData {
    number: string;
    body: string;
    token: string;
}

const SendMetaMessageService = async ({ number, body, token }: RequestData): Promise<any> => {
    try {
        const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${token}`;

        // Simplest Text Message format for Messenger
        // Note: Messenger and WhatsApp APIs differ slightly. 
        // This is a generic implementation assuming Messenger platform mostly.
        // For Instagram it is similar but we must ensure the number is actually a scoped ID.

        const messageData = {
            recipient: {
                id: number
            },
            message: {
                text: body
            }
        };

        const { data } = await axios.post(url, messageData);
        return data;
    } catch (err) {
        throw new AppError(err);
    }
};

export default SendMetaMessageService;
