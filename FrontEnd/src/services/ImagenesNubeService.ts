class ImagenesnubeService {
    async subirImagen(file: File): Promise<{ denominacion: string; eliminado: boolean }> {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "tienda_ropa");

        const res = await fetch("https://api.cloudinary.com/v1_1/dvyjtb1ns/image/upload", {
            method: "POST",
            body: data,
        });

        const fileUploaded = await res.json();

        return {
            denominacion: fileUploaded.secure_url,
            eliminado: false,
        };
    }
}

export default new ImagenesnubeService();
