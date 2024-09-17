import { Router } from "express";
import { createPost, deletePost, getPostById, listPosts, updatePost } from "../controllers/posts";

const postRoutes: Router = Router();

postRoutes.post('/', createPost)
postRoutes.get('/', listPosts)
postRoutes.get('/:id', getPostById)
postRoutes.put('/:id', updatePost)
postRoutes.delete('/:id', deletePost)

export default postRoutes;