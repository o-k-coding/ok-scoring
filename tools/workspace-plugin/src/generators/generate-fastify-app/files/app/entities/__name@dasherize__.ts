import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: '<%= underscore(name)%>' })
export class <%= classify(name)%>Entity {
    @PrimaryColumn()
    <%= camelize(name)%>Key: string;
}
