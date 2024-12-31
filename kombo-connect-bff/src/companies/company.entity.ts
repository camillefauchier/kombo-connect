import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number; // ID auto-généré

    @Column({ unique: true })
    companyName: string; // Nom de l'entreprise

    @Column({ unique: true })
    integrationId: string; // ID de l'intégration
}
