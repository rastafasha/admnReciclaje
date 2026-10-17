export class Terminos {
  _id?: string;
  tituloGlobal: string;
  introduccion: string;
  secciones: ISeccionLegal[];
  version: string;
  actualizadoEn: Date;
}

export class ISeccionLegal {
  _id?: string;
  subtitulo: string;
  contenido: string;
}