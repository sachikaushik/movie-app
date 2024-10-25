import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (typeof req.body === "string") {
      req.body = JSON.parse(req.body);
    }
    const { title, publishingYear, poster } = req.body;

    if (!title || !publishingYear || !poster) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newMovie = await prisma.movie.create({
        data: {
          title,
          publishingYear: Number(publishingYear),
          poster,
        },
      });
      res.status(201).json(newMovie);
    } catch (error) {
      res.status(500).json({ error: "Error adding movie" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
