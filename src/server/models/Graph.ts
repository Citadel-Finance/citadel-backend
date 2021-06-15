import {
  Column, DataType, Model, Table,
} from 'sequelize-typescript';

@Table
export class Graph extends Model {
  @Column({ type: DataType.DECIMAL, }) totalDeposited: string;

  @Column({ type: DataType.DECIMAL, }) totalBorrowed: string;

  @Column({ type: DataType.DECIMAL, }) totalProfit: string;
}
