import express from "express";
import { PrismaClient } from '@prisma/client'
import cors from 'cors';
const prisma = new PrismaClient()
const app = express();
const PORT = 5000;

app.use(cors())
app.use(express.json())

app.post("/api", async (req, res) => {
  const { name, email } = req.body

  if (!email || !name)
    return res.status(400).json({ message: "Email and name required fields!" })

  try {
    const existingUser = await prisma.waitList.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      console.log("Email already exists!")
      return res.status(400).json({ message: "Email already exists!" });
    }


    const createRow = await prisma.waitList.create({
      data: {
        name, email
      }
    })

    res.json(createRow);
  } catch (error) {
    res.status(400).send({message:error})
  }
});

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
