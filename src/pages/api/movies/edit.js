import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    if (typeof req.body === "string") {
      req.body = JSON.parse(req.body);
    }

    const { id, title, publishingYear, poster } = req.body;

    if (!id || !title || !publishingYear || !poster) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const updatedMovie = await prisma.movie.update({
        where: { id: Number(id) },
        data: {
          title,
          publishingYear: Number(publishingYear),
          poster,
        },
      });
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(500).json({ error: 'Error editing movie' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}