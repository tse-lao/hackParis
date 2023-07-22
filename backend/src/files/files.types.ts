import { File } from "buffer";
export interface FileUpload {
    file: File;
    jwtToken: string;
    address: string;
}