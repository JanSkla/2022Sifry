const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
export const GetRandomChar = () => {
    return chars.charAt(Math.floor(Math.random() * chars.length));
}