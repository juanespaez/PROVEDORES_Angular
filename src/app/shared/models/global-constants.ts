//clase con las constantes, rutas y patterns de toda la aplicacion
export class GlobalConstants {
    //Títulos de proyecto y paginas
    public static readonly nombreProyecto = 'Plantilla'
    public static readonly nombrePagina = 'Landing Page'
    public static readonly nombreSeccion = 'Dashboard'

    //Regex de validadores para forms
    public static readonly patternNumeros = '^[0-9]+$';

    //Regex para validar urls
    public static readonly protocolPattern = '^(https?:\\/\\/)?'
    public static readonly domainPattern = '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+'
    public static readonly localhostPattern = '|(localhost|ws-dev2.upb.edu.co)'
    public static readonly ipPattern = '|(\\d{1,3}(\\.\\d{1,3}){3})'
    public static readonly portPattern = '(\\:\\d+)?'
    public static readonly pathPattern = '(\\/[-a-z\\d%_.~+]*)*'
    public static readonly queryStringPattern = '(\\?[;&a-z\\d%_.~+=-]*)?'
    public static readonly fragmentPattern = '(\\#[-a-z\\d_]*)?$'

    public static readonly safeUrlPattern: RegExp = new RegExp(
        this.protocolPattern + // protocolo
        '(' + // Inicio del grupo para alternancia
        this.domainPattern + // nombre de dominio
        this.localhostPattern + // permite explícitamente localhost
        this.ipPattern + // dirección IP
        ')' + // Fin del grupo para alternancia
        this.portPattern + // puerto
        this.pathPattern + // ruta
        this.queryStringPattern + // cadena de consulta
        this.fragmentPattern, // fragmento
        'i'
      );

    //Rutas de redireccion
    public static readonly rutaUpb = 'https://www.upb.edu.co/'

    //texto footer
    public static readonly footer = "Este es un desarrollo de titularidad de la Universidad Pontificia Bolivariana, el cual se encuentra debidamente protegido; por favor absténgase de realizar cualquier acto que infrinja los derechos de propiedad intelectual. Copyright - Derechos de Autor. 2024. Todos los Derechos Reservados"
}
