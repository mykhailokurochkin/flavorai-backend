import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRecipe = async (data: {
  title: string;
  description?: string;
  imageUrl?: string;
  ingredients: string;
  instructions: string;
  preparationTime?: string;
  difficulty?: string;
  userId: number;
}) => {
  return prisma.recipe.create({
    data,
  });
};

export const getRecipes = async (search?: string) => {
  if (search) {
    return prisma.recipe.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });
  }
  return prisma.recipe.findMany();
};

export const getRecipeById = async (id: number) => {
  return prisma.recipe.findUnique({
    where: { id },
  });
};

export const getRecipesByUserId = async (userId: number) => {
  return prisma.recipe.findMany({
    where: { userId },
  });
};

export const updateRecipe = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    ingredients?: string;
    instructions?: string;
    preparationTime?: string;
    difficulty?: string;
  }
) => {
  return prisma.recipe.update({
    where: { id },
    data,
  });
};

export const deleteRecipe = async (id: number) => {
  return prisma.recipe.delete({
    where: { id },
  });
};
