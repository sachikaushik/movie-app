import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (totalItems, movies, page, limit) => {
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, movies, totalPages, currentPage };
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { limit, offset } = getPagination(req.query.page, req.query.size);
      const totalItems = await prisma.movie.count();
      const movies = await prisma.movie.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "asc",
        },
      });
      const response = getPagingData(totalItems, movies, req.query.page, limit);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving movies", message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
