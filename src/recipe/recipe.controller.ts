import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware.js';
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from './recipe.service.js';

interface AuthRequest extends Request {
  userId?: number;
}

const recipeRouter = Router();

recipeRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, ingredients, instructions } = req.body;
  const userId = req.userId;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: 'Title, ingredients, and instructions are required.' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const recipe = await createRecipe({ title, ingredients, instructions, userId });
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
  const { title, ingredients, instructions } = req.body;
  const userId = req.userId;

  try {
    const recipe = await getRecipeById(Number(id));

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    if (recipe.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this recipe.' });
    }

    const updatedRecipe = await updateRecipe(Number(id), { title, ingredients, instructions });
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
