import { User } from "./user";

export class Comunicado {
    _id?: string;
    titulo?: string;
    mensaje?: string;
    tipo?: 'SORTEO' | 'PREMIO_MERCADONA' | 'MANTENIMIENTO_PWA' | 'URGENTE' | 'AVISO_GENERAL';
    creado_por?: User;
    notificado_push?: boolean;
    createdAt?: Date;

    constructor() {
        this.tipo = 'AVISO_GENERAL'; // Valor ecológico por defecto
        this.notificado_push = false;
    }
}