import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware.js';
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, getRecipesByUserId } from './recipe.service.js';

interface AuthRequest extends Request {
  userId?: number;
}

const recipeRouter = Router();

recipeRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, description, imageUrl, ingredients, instructions, preparationTime, difficulty } = req.body;
  const userId = req.userId;

  console.log('Received ingredients:', ingredients);
  console.log('Type of ingredients:', typeof ingredients);
  console.log('Received instructions:', instructions);
  console.log('Type of instructions:', typeof instructions);

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: 'Title, ingredients, and instructions are required.' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const recipe = await createRecipe({ title, description, imageUrl, ingredients, instructions, preparationTime, difficulty, userId });
    return res.status(201).json(recipe);
  } catch (error) {
    console.error('Recipe creation error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

recipeRouter.get('/', async (req: Request, res: Response) => {
  const { search } = req.query;

  try {
    const recipes = await getRecipes(search as string | undefined);
    return res.status(200).json(recipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

recipeRouter.get('/my-recipes', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const recipes = await getRecipesByUserId(userId);
    return res.status(200).json(recipes);
  } catch (error) {
    console.error('Get user recipes error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

recipeRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const recipe = await getRecipeById(Number(id));
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    return res.status(200).json(recipe);
  } catch (error) {
    console.error('Get recipe by id error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

recipeRouter.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, imageUrl, ingredients, instructions, preparationTime, difficulty } = req.body;
  const userId = req.userId;

  try {
    const recipe = await getRecipeById(Number(id));

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    if (recipe.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this recipe.' });
    }

    const updatedRecipe = await updateRecipe(Number(id), { title, description, imageUrl, ingredients, instructions, preparationTime, difficulty });
    return res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

recipeRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const recipe = await getRecipeById(Number(id));

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    if (recipe.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this recipe.' });
    }

    await deleteRecipe(Number(id));
    return res.status(204).send();
  } catch (error) {
    console.error('Delete recipe error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default recipeRouter;

/*
 * Recipe Endpoints Summary:
 *
 * POST /api/recipes - Create a new recipe (Auth required)
 *   Request Body: { "title": "string", "description": "string", "imageUrl": "string", "ingredients": "string", "instructions": "string", "preparationTime": "string", "difficulty": "string" }
 * GET /api/recipes - Get all recipes (Optional: ?search=keyword for title search)
 * GET /api/recipes/my-recipes - Get all recipes for the authenticated user (Auth required)
 * GET /api/recipes/:id - Get a single recipe by ID
 * PUT /api/recipes/:id - Update a recipe by ID (Auth required, owner only)
 *   Request Body: { "title"?: "string", "description"?: "string", "imageUrl"?: "string", "ingredients"?: "string", "instructions"?: "string", "preparationTime"?: "string", "difficulty"?: "string" }
 * DELETE /api/recipes/:id - Delete a recipe by ID (Auth required, owner only)
 */