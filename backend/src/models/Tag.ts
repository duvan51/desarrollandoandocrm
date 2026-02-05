import Ticket from "./Ticket";
import TicketTag from "./TicketTag";
import User from "./User";
import Company from "./Company";
import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Unique,
    BelongsToMany,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";

@Table
class Tag extends Model<Tag> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column
    name: string;

    @Column({ defaultValue: "#7C7C7C" })
    color: string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @ForeignKey(() => Company)
    @Column
    companyId: number;

    @BelongsTo(() => Company)
    company: Company;

    @BelongsToMany(() => Ticket, () => TicketTag)
    tickets: Ticket[];
}

export default Tag;
