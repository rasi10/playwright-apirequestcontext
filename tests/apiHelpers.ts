import { APIRequestContext } from "@playwright/test";

export class APIHelper{
    private baseUrl: string;

    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
    }

    // localhost:3000/posts/{ID}
    //POST, GET, PUT, DELETE
    async getAllPosts(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/posts`);
        return response;
    }

    async getByID(request: APIRequestContext, postId: number) {
        const response = await request.get(`${this.baseUrl}/posts/${postId}`);
        return response;
    }

    async createPost(request: APIRequestContext, payload: object){
        const response = await request.post(`${this.baseUrl}/posts`, {
            data: JSON.stringify(payload),
        })
        return response;
    }

    async deletePost(request: APIRequestContext, postId: number){
        const response = await request.delete(`${this.baseUrl}/posts/${postId}`);
        return response;
    }

}