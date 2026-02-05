import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Default,
    DataType,
    HasMany
} from "sequelize-typescript";
import Company from "./Company";

@Table
class Plan extends Model<Plan> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string;

    @Default(0)
    @Column
    users: number;

    @Default(0)
    @Column
    whatsapps: number;

    @Default(0)
    @Column
    queues: number;

    @Column(DataType.DECIMAL(10, 2))
    value: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @HasMany(() => Company)
    companies: Company[];
}

export default Plan;
