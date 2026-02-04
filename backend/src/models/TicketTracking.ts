import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    AutoIncrement
} from "sequelize-typescript";

import Ticket from "./Ticket";
import User from "./User";
import Whatsapp from "./Whatsapp";

@Table
class TicketTracking extends Model<TicketTracking> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Ticket)
    @Column
    ticketId: number;

    @BelongsTo(() => Ticket)
    ticket: Ticket;

    @ForeignKey(() => Whatsapp)
    @Column
    whatsappId: number;

    @BelongsTo(() => Whatsapp)
    whatsapp: Whatsapp;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @Column
    finishedAt: Date;

    @Column
    ratingAt: Date;
}

export default TicketTracking;
