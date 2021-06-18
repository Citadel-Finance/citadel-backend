import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Col } from 'sequelize/types/lib/utils';

@Table
export class Graph extends Model {
  @Column({ type: DataType.DECIMAL }) deposited: string;

  @Column({ type: DataType.DECIMAL }) borrowed: string;

  @Column({ type: DataType.DECIMAL }) profit: string;

  @Column({ type: DataType.STRING }) pool: string;
}
