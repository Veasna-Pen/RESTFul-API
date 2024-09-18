import { json, Request, Response } from "express";
import { prismaClient } from "..";
import { PostSchema } from "../schema/post";

// Create Post
export const createPost = async (req: Request, res: Response) => {
    try {
        const validatedBody = PostSchema.parse(req.body);

        const post = await prismaClient.post.create({
            data: {
                title: validatedBody.title,
                content: validatedBody.content,
            }
        })
        res.status(201).json(post);

    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ message: "Validation error", errors: error.errors });
        } else {
            res.status(500).json({ message: "Error creating post", error: error.message });
        }
    }
}

// Get Post By Id
export const getPostById = async (req: Request, res: Response) => {

    const postId = req.params.id

    try {
        const post = await prismaClient.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post)
    } catch (error: any) {
        res.status(500).json({ message: "Error get post", error: error.message });
    }
}

// Update Post 
export const updatePost = async (req: Request, res: Response) => {
    const postId = req.params.id

    try {
        const validatedBody = PostSchema.parse(req.body);

        const post = await prismaClient.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
        }

        await prismaClient.post.update({
            where: {
                id: req.params.id,
            },
            data: {
                title: validatedBody.title,
                content: validatedBody.content,
            },
        });

        res.status(200).json({ message: "Post updated successfully" });

    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ message: "Validation error", errors: error.errors });
        } else {
            console.error("Error updating post:", error);
            res.status(500).json({ message: "Error updating post", error: error.message });
        }
    }
}

// Delete Post
export const deletePost = async (req: Request, res: Response) => {

    const postId = req.params.id

    try {
        const post = await prismaClient.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
        }

        await prismaClient.post.delete({
            where: {
                id: req.params.id,
            }
        })

        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
}

// List All Posts
export const listPosts = async (req: Request, res: Response) => {

    const posts = await prismaClient.post.findMany({
    });
    res.json(posts)
}
