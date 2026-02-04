import { Request, Response } from "express";
import { Op, fn, col, literal } from "sequelize";
import TicketTracking from "../models/TicketTracking";
import Ticket from "../models/Ticket";
import User from "../models/User";
import UserSessionLog from "../models/UserSessionLog";

export const index = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Leads accepted by user
        const leadsByUser = await TicketTracking.findAll({
            attributes: [
                "userId",
                [fn("COUNT", col("TicketTracking.id")), "count"]
            ],
            where: {
                userId: { [Op.ne]: null as any }
            },
            include: [{ model: User, attributes: ["name"] }],
            group: ["userId", "User.id", "User.name"] // Group by User.id/name is needed for include
        });

        // New leads today/yesterday/etc
        // Let's get leads for the last 7 days
        const date7DaysAgo = new Date();
        date7DaysAgo.setDate(date7DaysAgo.getDate() - 7);

        const newLeads = await Ticket.findAll({
            attributes: [
                [fn("DATE", col("createdAt")), "date"],
                [fn("COUNT", col("id")), "count"]
            ],
            where: {
                createdAt: {
                    [Op.gte]: date7DaysAgo
                }
            },
            group: [fn("DATE", col("createdAt"))],
            order: [[fn("DATE", col("createdAt")), "ASC"]]
        });

        // User Session Time
        // Fetch all sessions and sum them up
        const sessions = await UserSessionLog.findAll({
            include: [{ model: User, attributes: ["name", "email"] }],
            where: {
                logoutAt: { [Op.ne]: null as any }
            }
        });

        // Process sessions to calculate total time per user
        const userTimes: Record<string, { name: string, seconds: number }> = {};
        sessions.forEach(session => {
            const user = session.user;
            if (!user) return;

            if (!userTimes[user.id]) {
                userTimes[user.id] = { name: user.name, seconds: 0 };
            }
            const duration = (new Date(session.logoutAt).getTime() - new Date(session.loginAt).getTime()) / 1000;
            userTimes[user.id].seconds += duration;
        });

        return res.json({
            leadsByUser,
            newLeads,
            userTimes
        });
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
};
