import { environment } from '../../../environments/environment';
import { decrypt, encrypt } from '../utils/util-encrypt';

//clase que customiza el sesion storage de la aplicacion 
//para encriptar los items guardados y desencriptar los items leídos
//encripta con el key que se encuentra en environments y si la propiedad encrypt se encuentra en true
export abstract class StorageService implements Storage {

    get length(): number {
        return this.api.length
    }

    constructor(protected readonly api: Storage) {
    }

    clear(): void {
        this.api.clear()
    }

    getItem<T>(key: string): T | null {
        try {
            const data = this.api.getItem(key)
            if (data !== null) {
                if (environment.encrypt) {
                    return decrypt<T>(data)
                }
                return JSON.parse(data) as T
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    key(index: number): string | null {
        return this.api.key(index)
    }

    removeItem(key: string): void {
        this.api.removeItem(key)
    }

    setItem(key: string, value: unknown): void {
        let data = JSON.stringify(value)
        if (environment.encrypt) {
            data = encrypt(data)
        }
        this.api.setItem(key, data)
    }
}
