import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRecipe = async (data: { title: string; ingredients: string; instructions:string; userId: number }) => {
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

export const updateRecipe = async (id: number, data: { title?: string; ingredients?: string; instructions?: string }) => {
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
