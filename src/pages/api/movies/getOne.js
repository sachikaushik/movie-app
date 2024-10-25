import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    try {
      const movie = await prisma.movie.findUnique({
        where: { id: Number(id) },
      });

      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      res.status(200).json(movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({ error: "Error fetching movie details" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
